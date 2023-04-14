const asyncHandler = require('express-async-handler')


// import the models

const questionModel = require('../models/questionModel')




//post questions

const postQuestion = asyncHandler(async(req,res)=>{
    const question = await questionModel.create(req.body)
    res.status(200).json(question);
})




//get answered questions

const answeredQuestion = asyncHandler(async(req,res)=>{
    if(req.body.status=="answered"){ 
        const question = await questionModel.find(req.body)
        res.status(200).json(question);
    }
})




//get unanswered questions

const unansweredQuestion = asyncHandler(async(req,res)=>{
    if(req.body.status!="answered"){ 
        const question = await questionModel.find(req.body)
        res.status(200).json(question);
    }
    else res.json({message: 'all are answered'})
})



//export the endpoints

module.exports ={ postQuestion , answeredQuestion , unansweredQuestion}