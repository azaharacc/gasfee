import cron from "node-cron";
import User from "../models/user.js";
import { getGasPrice } from "../services/gasService.js";
import { sendEmailAlert } from "../services/notify.js";

let dbReady = false;
export function startGasChecker() {
  if (dbReady) {
    cron.schedule("*/5 * * * *", async () => {
      console.log("⏳ Revisando gas...");
      try {
        const gas = await getGasPrice();
        const users = await User.find();
        for (const user of users) {
          if (gas <= user.gasThreshold) {
            await sendEmailAlert(user.email, gas);
          }
        }
      } catch (err) {
        console.error("Error en gasChecker:", err.message);
      }
    });
  }
}

export function setDBReady() {
  dbReady = true;
}
