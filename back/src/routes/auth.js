import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.mur.at",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Will keep this deactivated for now 
/*router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Valid email address and password of at least 6 characters required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "The user is already registered." });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const newUser = new User({
      email,
      password,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();

    // Send email alert
    const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
    await transporter.sendMail({
      from: `"Gas Fee Detector" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Please verify your account",
      html: `<h3>Confirm your account. </h3><p><a href="${verificationLink}">Click here to verify</a></p>`,
    });

    res.json({ message: "Registration successful. Check your email to verify your account." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
*/
// Email verification to sign up
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      // Search if user is already verified
      const verifiedUser = await User.findOne({ isVerified: true, verificationToken: { $exists: false } });
      if (verifiedUser) {
        return res.json({ message: "✅ Verificación ya completada" });
      }

      return res.status(400).json({ error: "Token inválido o ya usado" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "✅ Verificación completada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la verificación" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    // search user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // validate email verification
    if (!user.isVerified) {
      return res.status(403).json({ error: "⚠️ Verifica tu email antes de iniciar sesión" });
    }

    // verify password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "✅ Login correcto",
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;