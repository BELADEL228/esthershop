import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
const FROM_DOMAIN = 'onboarding@resend.dev'; // ou votre domaine

export const sendContactMessage = async (name, email, subject, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Esther Shop <${FROM_DOMAIN}>`,
      to: ['esthernabede08@gmail.com', 'beleiabel8@gmail.com'], // Vos emails
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
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi message:', error);
    throw error;
  }
};