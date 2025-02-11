const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is available
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Please check your environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
