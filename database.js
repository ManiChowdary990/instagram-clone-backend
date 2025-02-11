const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);


    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
