//Import/Require Mongoose

const mongoose = require('mongoose')


//Define schema for question

const QuestionSchema = mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    user_ID : Number,
    body : String,
    status : String,
    upvotes : Number,
    asked_At : {type : Date, default : Date.now },
    subject : {type : String, length : 30 }, //didn't get maxLenght arg
    action : {type : Boolean, default : true},
    comments :[{ 
        id : mongoose.Schema.Types.ObjectId,
        user_ID : Number,
        body : String,
        //can add other features
    }],
    answers : [{
        id : mongoose.Schema.Types.ObjectId,
        user_ID : Number,
        body : String,
        //can add other features
        upvotes : Number,
        comments :[{
            id : mongoose.Schema.Types.ObjectId,
            user_ID : Number,
            body : String,
            //can add other features
        }],
    }],

});

//create model of the schema

const questionModel = mongoose.model("questionModel",QuestionSchema);

// export the model

module.exports = questionModel;

