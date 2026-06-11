require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./api/models/userModel");
const bcrypt = require("bcryptjs");

async function checkSmpUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const user = await userModel.findOne({ user_ID: "smp" });
    if (user) {
      console.log("User found:");
      console.log("Name:", user.name);
      console.log("User ID:", user.user_ID);
      console.log("Role:", user.role);
      
      const isMatch = await bcrypt.compare("smp", user.password);
      console.log("Password 'smp' matches hash:", isMatch);
    } else {
      console.log("User 'smp' NOT found in database.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error checking user:", err);
    process.exit(1);
  }
}

checkSmpUser();
