const mongoose = require("mongoose");


//schema for students
 const studentSchema = mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name:{type:String,default:""},
        roll_number: {type:Number},
        password:{type:String,default:""},
        asked_questions:{type:String,default:""},
        upvoted_questions:{type:String,default:""}, 
        comments:{type:String,default:""},
    }
 )

 const studentModel = mongoose.model("studentModel",studentSchema);


 module.exports= studentModel;