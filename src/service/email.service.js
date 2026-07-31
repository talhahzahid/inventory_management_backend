import sgMail from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(to, subject, text, html = "") {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  const fromEmail =
    process.env.EMAIL_FROM || "talhazahid2038@gmail.com";
  const fromName = process.env.EMAIL_FROM_NAME || "Inventory App";

  try {
    return await sgMail.send({
      to,
      from: { email: fromEmail, name: fromName },
      subject,
      text,
      ...(html ? { html } : {}),
    });
  } catch (error) {
    const details = error?.response?.body?.errors;
    console.error("SendGrid error body:", JSON.stringify(details, null, 2));
    const message = details?.map((e) => e.message).join("; ") || error.message;
    throw new Error(`SendGrid: ${message}`);
  }
}
