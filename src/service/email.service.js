import resend from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(to, subject, text, html = "") {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.EMAIL_FROM || "Inventory App <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}
