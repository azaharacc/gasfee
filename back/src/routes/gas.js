import express from "express";
import { getGasPrice } from "../services/gasService.js";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

// current gas (private route jwt)
router.get("/", auth, async (req, res) => {
  const gasPrice = await getGasPrice();
  const user = await User.findById(req.user.id);
  res.json({
    gasPrice: `${gasPrice.toFixed(2)} gwei`,
    threshold: `${user.gasThreshold} gwei`,
    goodToDeploy: gasPrice <= user.gasThreshold
  });
});

// Change threshold
router.post("/threshold", auth, async (req, res) => {
  const { gasThreshold } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { gasThreshold }, { new: true });
  res.json({ message: "✅ Threshold updated", gasThreshold: user.gasThreshold });
});

export default router;
