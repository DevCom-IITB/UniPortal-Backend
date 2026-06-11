require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./api/models/userModel");
const bcrypt = require("bcryptjs");
const ROLES_LIST = require("./config/roles_list");

async function resetSmpUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Remove existing smp user to be absolutely fresh
    await userModel.deleteMany({ user_ID: "smp" });
    console.log("Removed existing 'smp' user(s).");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("smp", salt);
    
    await userModel.create({
      name: "SMP User",
      user_ID: "smp",
      password: hashedPassword,
      role: ROLES_LIST.SMP,
    });
    
    console.log("Successfully recreated 'smp' user with password 'smp'.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error resetting user:", err);
    process.exit(1);
  }
}

resetSmpUser();
