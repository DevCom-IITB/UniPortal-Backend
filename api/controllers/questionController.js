const asyncHandler = require('express-async-handler')  // the function of async handler here is to handle errors in async functions. https://www.npmjs.com/package/express-async-handler

// import the models

const questionModel = require('../models/questionModel')


//-------------------------------------------------------------------------------------------------------------------------------------

//post questions
const postQuestion = asyncHandler(async (req, res) => {
    if(!req.body.user_ID || !req.body.body){
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    const question = new questionModel({
        user_ID: req.body.user_ID,
        body: req.body.body,
        //reason I didn't initialise comment or answer is because it used to create a default answer and comment
    });
    await question
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});



//answers 
// get all questions
// try to implement that one request you send a limited number of questions and then when you scroll down you send another request with the next set of questionss
const allQuestions = asyncHandler(async (req, res) => {
    try {
        const questions = await questionModel.find()
        res.json(questions)
    }
    catch (err) {
        res.send(err)
    }
})


//gets only answered questions along with answers
const answeredQuestions = asyncHandler(async (req, res) => {
    try {
        const questions = await questionModel.find({ "status": true })
        res.json(questions)
    }
    catch (err) {
        res.send(err)
    }
})


//gets all unanswered questions
const unansweredQuestions = asyncHandler(async (req, res) => {
    try {
        const questions = await questionModel.find({ "status": false })
        res.json(questions)

    }
    catch (err) {
        res.send(err)
    }
})



//answering a question
const answerQ = asyncHandler(async (req, res) => {
    if(!req.body.answers.user_ID || !req.body.answers.body){
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    try {
        const update = await questionModel.updateOne(
            { _id: req.params.qid }, // this line is to find the question with the id
            { $push: { answers: req.body.answers } ,$set:{status:true}} 
        );
        res.json(update);
    } catch (err) {
        res.send(err);
    }
});


//Commenting
//Commenting on a question
const commentQ = asyncHandler(async (req, res) => {
    try {
        const update = await questionModel.updateOne(
            { _id: req.params.qid },
            { $push: { comments: req.body.comments } }
        );
        res.json(update);
    } catch (err) {
        res.send(err);
    }
});


//commenting on an answer, qid= question id and aid is answer id
const commentA = asyncHandler(async (req, res) => {
    
    try {
        const update = await questionModel.updateOne(
            { _id: req.params.qid },
            { $push: { 'answers.$[j].comments': req.body.comments } },
            {
                arrayFilters: [
                    {
                        "j._id": req.params.aid
                    }
                ]
            }
        );
        res.json(update);
    } catch (err) {
        res.send(err);
    }
});



//upvoting
//upvoting question
const upvoteQ =  asyncHandler(async(req, res) => {
    const update = await questionModel.updateOne({_id:req.params.qid},{$inc:{upvotes:1}})
    res.json(update)
  });


//upvoting answer
const upvoteA= asyncHandler(async (req, res) => {
    try {
      const update = await questionModel.updateOne(
        { _id: req.params.qid },
        { $inc: { 'answers.$[j].upvotes':1 } },// $inc is used to increment the value of a field
        { arrayFilters: [
              {
                "j._id": req.params.aid
              }
            ]
          }
      );
      res.json(update);
    } catch (err) {
      res.send(err);
    }
  });


//exporting
module.exports = { postQuestion, allQuestions, answeredQuestions, unansweredQuestions, answerQ, commentQ, commentA,upvoteQ,upvoteA}