import { FedaPay, Transaction } from 'fedapay';

// Initialisation du client FedaPay
const initFedaPay = () => {
  FedaPay.setApiKey(import.meta.env.VITE_FEDAPAY_SECRET_KEY);
  FedaPay.setEnvironment(import.meta.env.VITE_FEDAPAY_ENVIRONMENT);
  return FedaPay;
};

/**
 * Traite un paiement Mobile Money via FedaPay
 * @param {Object} params - Paramètres du paiement
 * @param {number} params.amount - Montant en FCFA
 * @param {string} params.provider - 'moov_tg' ou 'togocel' [citation:1]
 * @param {string} params.phone - Numéro de téléphone du client
 * @param {Object} params.customer - Informations client
 * @param {Object} params.orderData - Données de la commande
 */
export const processMobileMoney = async ({ amount, provider, phone, customer, orderData }) => {
  try {
    initFedaPay();
    
    // Créer la transaction FedaPay
    const transaction = await Transaction.create({
      amount: Math.round(amount), // FedaPay attend un entier [citation:1]
      description: `Commande Esther Shop #${orderData.id || 'nouvelle'}`,
      callback_url: `${window.location.origin}/payment/callback`,
      currency: { iso: 'XOF' },
      customer: {
        firstname: customer.firstName,
        lastname: customer.lastName,
        email: customer.email,
        phone_number: {
          number: phone.replace(/\s/g, ''), // Supprimer les espaces
          country: 'tg' // Togo
        }
      },
      metadata: {
        order_id: orderData.id,
        provider: provider,
        items: JSON.stringify(orderData.items?.map(i => ({ id: i.id, quantity: i.quantity })))
      }
    });

    console.log('✅ Transaction FedaPay créée:', transaction.id);

    // FedaPay génère un token et une URL de paiement [citation:9]
    const paymentData = await transaction.generateToken();
    
    return {
      success: true,
      transactionId: transaction.id,
      paymentToken: paymentData.token,
      paymentUrl: paymentData.url,
      message: 'Veuillez confirmer le paiement sur votre téléphone'
    };
    
  } catch (error) {
    console.error('❌ Erreur FedaPay:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'initialisation du paiement'
    };
  }
};

/**
 * Traite un paiement par carte bancaire via FedaPay
 * FedaPay supporte aussi Visa/Mastercard [citation:8]
 */
export const processCardPayment = async ({ amount, customer, orderData }) => {
  try {
    initFedaPay();
    
    const transaction = await Transaction.create({
      amount: Math.round(amount),
      description: `Commande Esther Shop #${orderData.id || 'nouvelle'}`,
      callback_url: `${window.location.origin}/payment/callback`,
      currency: { iso: 'XOF' },
      customer: {
        firstname: customer.firstName,
        lastname: customer.lastName,
        email: customer.email,
        phone_number: {
          number: customer.phone.replace(/\s/g, ''),
          country: 'tg'
        }
      },
      metadata: {
        order_id: orderData.id,
        payment_type: 'card'
      }
    });

    const paymentData = await transaction.generateToken();
    
    return {
      success: true,
      transactionId: transaction.id,
      paymentUrl: paymentData.url,
      message: 'Redirection vers la page de paiement sécurisé'
    };
    
  } catch (error) {
    console.error('❌ Erreur FedaPay carte:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Vérifie le statut d'une transaction
 */
export const checkTransactionStatus = async (transactionId) => {
  try {
    initFedaPay();
    const transaction = await Transaction.retrieve(transactionId);
    
    // Les statuts possibles : pending, approved, canceled, declined [citation:4]
    return {
      success: true,
      status: transaction.status,
      transaction: transaction
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};