const mongoose = require("mongoose");

//comment schema
const commentSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    user_ID: {type:Number,default:0},
    body: {type:String,default:""},
  }
)


//answer schema
const AnswerSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    user_ID: {type:Number,default:0
    },
    body: {type:String,default:""},
    upvotes:{type:Number,default:0},
    comments: [
      commentSchema
    ],
  },

);


//question schema
const QuestionSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user_ID: { type: Number, default: 0 },
  hidden:{type:Boolean,default:false},
  body: { type: String, default: "" },
  subject:{ type: String, default: "" },
  status: { type: Boolean, default:false},
  upvotes: { type: Number, default: "0" },
  asked_At: { type: Date, default: Date.now },
  answers: [ AnswerSchema],
  comments: [commentSchema]
});



//create model of the schema
const questionModel = mongoose.model("questionModel",QuestionSchema);

// export the model
module.exports = questionModel;

