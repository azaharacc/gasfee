import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);

export async function getGasPrice() {
  const feeData = await provider.getFeeData();
  return Number(ethers.formatUnits(feeData.gasPrice, "gwei"));
}
