const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // ✅ This is ignored in MongoDB 4.0+, but safe to keep
      useUnifiedTopology: true, // ✅ This is ignored in MongoDB 4.0+, but safe to keep
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
