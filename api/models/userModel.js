const mongoose = require("mongoose");


//schema for students
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

 const studentModel = mongoose.model("studentModel",studentSchema);


 module.exports= studentModel;