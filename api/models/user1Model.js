const mongoose = require("mongoose");

//schema for students
const freshieSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, default: "" },
  rollnumber: { type: Number, unique: true },
  password: { type: String, default: "" },
  asked_questions: { type: String, default: "" },
  upvoted_questions: { type: String, default: "" },
  comments: { type: String, default: "" },
});

const freshieModel = mongoose.model("freshieModel", freshieSchema);

module.exports = freshieModel;
