require("dotenv").config();
const mongoose = require("mongoose");
const infopostModel = require("./api/models/infopostModel");

async function clearInfoposts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const result = await infopostModel.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} announcements (infoposts).`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing announcements:", err);
    process.exit(1);
  }
}

clearInfoposts();
