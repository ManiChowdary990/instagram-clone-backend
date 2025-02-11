const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔍 Checking MONGO_URI:", process.env.MONGO_URI); // Debug log

    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment variables");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
