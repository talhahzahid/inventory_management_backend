import sgMail from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(to, subject, text, html = "") {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  const from =
    process.env.EMAIL_FROM || "Inventory App <talhazahid2038@gmail.com>";

  return await sgMail.send({
    to,
    from,
    subject,
    text,
    ...(html ? { html } : {}),
  });
}
