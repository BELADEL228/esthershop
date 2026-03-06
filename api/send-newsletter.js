// api/send-newsletter.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { subscribers, subject, htmlContent } = req.body;

    // Vérifier les variables d'environnement
    if (!process.env.VITE_GMAIL_USER || !process.env.VITE_GMAIL_APP_PASSWORD) {
      return res.status(500).json({ 
        success: [], 
        failed: [{ error: 'Configuration email manquante' }] 
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.VITE_GMAIL_USER,
        pass: process.env.VITE_GMAIL_APP_PASSWORD
      }
    });

    const results = { success: [], failed: [] };

    for (const email of subscribers) {
      try {
        const info = await transporter.sendMail({
          from: `"Esther Shop" <${process.env.VITE_GMAIL_USER}>`,
          to: email,
          subject: subject,
          html: htmlContent
        });
        
        results.success.push({ email, id: info.messageId });
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        results.failed.push({ email, error: error.message });
      }
    }

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ 
      success: [], 
      failed: [{ error: error.message }] 
    });
  }
}