const mongoose = require("mongoose"); //This imports the Mongoose library, which is the Object Data Modeling (ODM) tool used to interact with MongoDB.

//schema for students
const userSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  user_ID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  asked_questions: [],
  upvoted_questions: [],
  upvoted_answers: [],
  question_comments: [],
  answer_comments: [],
  answered_questions: [],
  role: { type: Number, required: true },
  //A numeric value that determines the user's permissions (e.g., 0 for Student, 1 for Mentor/SMPC).
  refreshToken: [String],
  //An array to store JSON Web Tokens used for maintaining user sessions.
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
//module.exports: Makes this model available to be imported into your controllers (like authController.js) to handle logic.