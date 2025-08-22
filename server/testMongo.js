// server/testMongo.js
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/examdb"; // change 'examdb' if your DB name is different

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connection successful!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
