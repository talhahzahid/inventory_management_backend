import transporter from '../config/mailer.js';
import dotenv from 'dotenv';
dotenv.config ();

export async function sendEmail (to, subject, text, html = '') {
  return await transporter.sendMail ({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
