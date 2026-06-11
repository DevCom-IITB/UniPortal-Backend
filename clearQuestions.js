require("dotenv").config();
const mongoose = require("mongoose");
const questionModel = require("./api/models/questionModel");

async function clearQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const result = await questionModel.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} questions and their answers.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing questions:", err);
    process.exit(1);
  }
}

clearQuestions();
