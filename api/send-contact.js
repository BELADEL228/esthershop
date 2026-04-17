import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // 2. Valider les données
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // 3. Créer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.VITE_GMAIL_USER,     // tes identifiants Gmail
        pass: process.env.VITE_GMAIL_APP_PASSWORD // mot de passe d'application (sans espaces)
      }
    });

    // 4. Configurer l'email
    const mailOptions = {
      from: `"Jenny Shop" <${process.env.VITE_GMAIL_USER}>`,
      to: ['Jennynabede08@gmail.com', 'beleiabel8@gmail.com'],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        Nouveau message de contact
        Nom: ${name}
        Email: ${email}
        Sujet: ${subject}
        Message: ${message}
      `
    };

    // 5. Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);

    // 6. Répondre au frontend
    res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'envoi' 
    });
  }
}