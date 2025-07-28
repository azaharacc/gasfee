import cron from "node-cron";
import User from "../models/user.js";
import { getGasPrice } from "../services/gasService.js";
import { sendEmailAlert } from "../services/notify.js";

// Revisa cada 5 min
cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Revisando gas...");
  const gas = await getGasPrice();
  const users = await User.find();
  for (const user of users) {
   if (gas <= user.gasThreshold) {
    await sendEmailAlert(user.email, gas);
}
  }
});
