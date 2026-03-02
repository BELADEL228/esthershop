// api/webhook/fedapay.js
import { createClient } from '@supabase/supabase-js';

// Cache pour éviter de recréer le client à chaque appel
let supabaseInstance = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseInstance;
};

/**
 * Vérifie la signature du webhook FedaPay
 */
const verifySignature = (payload, signature, secret) => {
  if (!signature || !secret) return false;
  
  // En environnement serverless, on utilise crypto web
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const data = encoder.encode(payload);
  
  // Note: Cette vérification doit être adaptée selon la méthode de FedaPay
  // Référez-vous à la documentation FedaPay pour la méthode exacte
  return true; // À remplacer par la vraie vérification
};

/**
 * Met à jour le statut de la commande
 */
const updateOrderStatus = async (transactionId, status, paymentData) => {
  const supabase = getSupabase();
  
  const statusMap = {
    'approved': { order: 'processing', payment: 'paid' },
    'success': { order: 'processing', payment: 'paid' },
    'pending': { order: 'pending', payment: 'pending' },
    'declined': { order: 'cancelled', payment: 'failed' },
    'canceled': { order: 'cancelled', payment: 'cancelled' }
  };

  const mapping = statusMap[status] || { order: 'pending', payment: 'pending' };

  const { error } = await supabase
    .from('orders')
    .update({
      status: mapping.order,
      payment_status: mapping.payment,
      payment_details: paymentData,
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', transactionId);

  if (error) throw error;
  return true;
};

export default async function handler(req, res) {
  // 1. Vérifier que c'est bien une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Seules les requêtes POST sont acceptées'
    });
  }

  try {
    // 2. Récupérer les headers et le body
    const signature = req.headers['x-fedapay-signature'];
    const payload = JSON.stringify(req.body);
    
    console.log('📨 Webhook reçu - Timestamp:', new Date().toISOString());
    console.log('📦 Type:', req.body?.type);

    // 3. Vérifier la signature (sécurité)
    const isValid = verifySignature(
      payload,
      signature,
      process.env.FEDAPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error('❌ Signature invalide');
      return res.status(401).json({ error: 'Signature invalide' });
    }

    const event = req.body;

    // 4. Traiter selon le type d'événement
    switch (event.type) {
      case 'transaction.approved':
      case 'transaction.success':
        console.log('💰 Paiement approuvé:', event.data.id);
        await updateOrderStatus(event.data.id, 'approved', event.data);
        break;

      case 'transaction.declined':
        console.log('❌ Paiement refusé:', event.data.id);
        await updateOrderStatus(event.data.id, 'declined', event.data);
        break;

      case 'transaction.canceled':
        console.log('⏹️ Paiement annulé:', event.data.id);
        await updateOrderStatus(event.data.id, 'canceled', event.data);
        break;

      default:
        console.log('ℹ️ Événement non géré:', event.type);
    }

    // 5. Répondre à FedaPay pour accuser réception
    return res.status(200).json({ 
      received: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    return res.status(500).json({ 
      error: 'Erreur interne',
      message: error.message 
    });
  }
}

// Configuration pour Vercel (optionnel)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};