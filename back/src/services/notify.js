// src/services/notify.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// config email from where send alert
const transporter = nodemailer.createTransport({
  host: "mail.mailo.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmailAlert(to, gas) {
  try {
    await transporter.sendMail({
      from: `"Gas Fee Alert" <${process.env.EMAIL_USER}>`,
      to,
      subject: "⚡ Low gas fee, it is a good moment to deploy",
      text: `Current gas fee is ${gas} gwei. ¡You can deploy now!`
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}
