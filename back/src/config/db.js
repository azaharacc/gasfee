import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error en MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
