import { Resend } from 'resend';

// Initialisation du client Resend avec votre clé API
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

// Domaine d'envoi (à modifier selon votre configuration)
// Pour les tests : utilisez 'onboarding@resend.dev'
// Pour la production : utilisez 'newsletter@votre-domaine.com'
const FROM_DOMAIN = import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = 'Esther Shop';

/**
 * Envoie un email individuel
 * @param {string} to - Email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} htmlContent - Contenu HTML de l'email
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const sendNewsletter = async (to, subject, htmlContent) => {
  try {
    console.log(`📧 Envoi à ${to}...`);
    
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_DOMAIN}>`,
      to: [to],
      subject: subject,
      html: htmlContent,
      // Version texte automatique (supprime les balises HTML)
      text: htmlContent.replace(/<[^>]*>/g, ''),
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    console.log('✅ Email envoyé:', data?.id);
    return { 
      success: true, 
      id: data?.id 
    };
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Envoie une newsletter à TOUS les abonnés actifs
 * @param {Array} subscribers - Liste des abonnés
 * @param {string} subject - Sujet de la newsletter
 * @param {string} htmlContent - Contenu HTML
 * @returns {Promise<{success: Array, failed: Array}>}
 */
export const sendBulkNewsletter = async (subscribers, subject, htmlContent) => {
  const results = {
    success: [],
    failed: []
  };

  // Filtrer les abonnés valides
  const validSubscribers = subscribers.filter(s => s?.email && s.is_active);
  
  if (validSubscribers.length === 0) {
    return results;
  }

  console.log(`📨 Envoi groupé à ${validSubscribers.length} abonnés...`);

  // Envoyer un par un pour éviter les rate limits
  for (const subscriber of validSubscribers) {
    try {
      const result = await sendNewsletter(
        subscriber.email, 
        subject, 
        htmlContent
      );
      
      if (result.success) {
        results.success.push({
          email: subscriber.email,
          id: result.id
        });
      } else {
        results.failed.push({
          email: subscriber.email,
          error: result.error
        });
      }
      
      // Petit délai pour respecter les limites de l'API (20 requêtes/sec max)
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      results.failed.push({
        email: subscriber.email,
        error: error.message
      });
    }
  }

  console.log('📊 Résultats:', results);
  return results;
};

/**
 * Crée un template HTML professionnel pour la newsletter
 * @param {string} subject - Sujet de la newsletter
 * @param {string} content - Contenu en HTML
 * @returns {string} Template HTML complet
 */
export const createNewsletterTemplate = (subject, content) => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        /* Reset styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f4f4f5;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .content {
          background-color: #ffffff;
          padding: 40px 30px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .footer {
          text-align: center;
          padding: 20px;
          color: #666666;
          font-size: 12px;
        }
        
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #2563eb;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        
        .button:hover {
          background-color: #1d4ed8;
        }
        
        .unsubscribe {
          color: #999999;
          font-size: 11px;
          text-decoration: none;
          margin-top: 20px;
          display: inline-block;
        }
        
        .unsubscribe:hover {
          color: #666666;
        }
        
        @media only screen and (max-width: 480px) {
          .content {
            padding: 20px 15px;
          }
          
          .header h1 {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Esther Shop ✨</h1>
          <p>Votre boutique en ligne à Lomé</p>
        </div>
        
        <div class="content">
          ${content}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://esther-shop.com" class="button">
              Découvrir nos produits
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>© ${currentYear} Esther Shop. Tous droits réservés.</p>
          <p>Lomé, Togo</p>
          <p>
            <a href="#" class="unsubscribe">
              Se désabonner de la newsletter
            </a>
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #cccccc;">
            Si vous ne souhaitez plus recevoir nos emails, cliquez sur le lien de désabonnement ci-dessus.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Envoie un email de test
 * @param {string} testEmail - Email pour le test
 */
export const sendTestEmail = async (testEmail) => {
  const testContent = `
    <h2 style="color: #2563eb;">🎉 Test réussi !</h2>
    <p>Félicitations ! Votre configuration d'envoi d'emails fonctionne parfaitement.</p>
    <p>Vous pouvez maintenant envoyer de vraies newsletters à vos abonnés.</p>
    <ul style="margin: 20px 0;">
      <li>✅ Service Resend configuré</li>
      <li>✅ Template HTML fonctionnel</li>
      <li>✅ Envoi opérationnel</li>
    </ul>
    <p style="margin-top: 20px;">Bonne continuation avec Esther Shop ! 🚀</p>
  `;
  
  return sendNewsletter(
    testEmail,
    '✅ Test de configuration réussi - Esther Shop',
    createNewsletterTemplate('Test de configuration', testContent)
  );
};