const mongoose = require("mongoose");

//schema for students
 const userSchema = mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name:{type:String,required:true},
        user_ID: {type:String, required:true, unique:true},
        password:{type:String,required:true},
        email:{type:String,required:false,default:""},
        asked_questions:[],
        upvoted_questions:[], 
        upvoted_answers:[],
        question_comments:[],
        answer_comments:[],
        answered_questions:[],
        role:{type : Number, required:true},
        refreshToken:[String]
    }
 )

 


const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
