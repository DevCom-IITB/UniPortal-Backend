const mongoose = require("mongoose");

//schema for students
<<<<<<<< HEAD:api/models/userModel.js
 const studentSchema = mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name:{type:String,required:true},
        user_ID: {type:Number, required:true},
        password:{type:String,required:true},
        asked_questions:{type:String,default:""},
        upvoted_questions:{type:String,default:""}, 
        comments:{type:String,default:""},
        roles:{
            freshie:{
                type:Number,
                default:7669
            },
            SMP:Number,
            ADMIN:Number
        },
        refreshToken:[String]
    }
 )
========
const freshieSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, default: "" },
  rollnumber: { type: Number, unique: true },
  password: { type: String, default: "" },
  asked_questions: { type: String, default: "" },
  upvoted_questions: { type: String, default: "" },
  comments: { type: String, default: "" },
});
>>>>>>>> 05791f13198129189476a76f8af3e3cc8bd219bb:api/models/user1Model.js

const freshieModel = mongoose.model("freshieModel", freshieSchema);

module.exports = freshieModel;
