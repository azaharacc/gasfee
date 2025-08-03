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
      subject: "⚡ Gas fee bajo, es buen momento para hacer deploy",
      text: `El gas actual es de ${gas} gwei. ¡Aprovecha para hacer deploy!`
    });
    console.log(`📧 Email enviado a ${to}`);
  } catch (err) {
    console.error("❌ Error enviando email:", err);
  }
}
