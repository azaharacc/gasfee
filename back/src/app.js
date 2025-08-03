import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import gasRoutes from "./routes/gas.js";
import "./jobs/gasChecker.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { startGasChecker, setDBReady } from "./jobs/gasChecker.js";

dotenv.config();
connectDB().then(() => {
  setDBReady();
  startGasChecker();
});

const app = express();
app.use(express.json());
console.log("👉 CLIENT_URL:", process.env.CLIENT_URL);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

 
// define __dirname to serve public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static files before api routes
app.use(express.static(path.join(__dirname, "../public")));
// api routes
app.use("/auth", authRoutes);
app.use("/gas", gasRoutes);

const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
