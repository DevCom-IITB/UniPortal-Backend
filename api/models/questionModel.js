const mongoose = require("mongoose");

//comment schema
const commentSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: String, required: true },
  user_Name: { type: String, default: "" },
  body: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  asked_At: { type: Date, default: Date.now },
});

//answer schema..
const AnswerSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: String, required: true },
  user_Name: { type: String, default: "" },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  // images: [{ type: mongoose.Schema.Types.ObjectId, ref: imageModel }],
  images: [{ type: String }],
  hidden: { type: Boolean, default: false },
  comments: [commentSchema],
  verified: { type: Boolean, default: false },
  asked_At: { type: Date, default: Date.now },
});

//question schema
const QuestionSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: String, required: true },
  user_Name: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
  body: { type: String, required: true },
  status: { type: Boolean, default: false },
  upvotes: { type: Number, default: "0" },
  asked_At: { type: Date, default: Date.now },
  //images: [{ type: mongoose.Schema.Types.ObjectId, ref: imageModel }],
  images: [{ type: String }],
  answers: [AnswerSchema],
  comments: [commentSchema],
  verified: { type: Boolean, default: false },
});

//create model of the schema
const questionModel = mongoose.model("questionModel", QuestionSchema);

// export the model
module.exports = questionModel;
