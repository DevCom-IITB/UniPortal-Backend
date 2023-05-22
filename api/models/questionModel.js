const mongoose = require("mongoose");

// import imageSchema
const imageModel = require("./imageModel");

//comment schema
const commentSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: Number, required: true },
  user_Name: { type: String, default: "" },
  body: { type: String, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: imageModel }],
  hidden: { type: Boolean, default: false },
});

//answer schema..
const AnswerSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: Number, required: true },
  user_Name: { type: String, default: "" },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: imageModel }],
  hidden: { type: Boolean, default: false },
  comments: [commentSchema],
});

//question schema
const QuestionSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: Number, required: true },
  user_Name: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
  body: { type: String, required: true },
  subject: { type: String, default: "" },
  status: { type: Boolean, default: false },
  upvotes: { type: Number, default: "0" },
  asked_At: { type: Date, default: Date.now },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: imageModel }],
  hidden: { type: Boolean, default: false },
  answers: [AnswerSchema],
  comments: [commentSchema],
});

//create model of the schema
const questionModel = mongoose.model("questionModel", QuestionSchema);

// export the model
module.exports = questionModel;
