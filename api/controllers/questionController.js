<<<<<<< HEAD
const asyncHandler = require('express-async-handler') 
=======
>>>>>>> 5d5ed793d5bb7530214727ab3c9f1fc86f3f0603

// import the models

const questionModel = require('../models/questionModel')


//-------------------------------------------------------------------------------------------------------------------------------------

//post questions
const postQuestion = async (req, res) => {
    const question = new questionModel({
        body: req.body.body,
        subject: req.body.subject,
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
};




//answers

const allQuestions = async (req, res) => {
    try {
        const questions = await questionModel.find()
        res.json(questions)
    }
    catch (err) {
        res.send(err)
    }
}


//gets only answered questions along with answers
const answeredQuestions = async (req, res) => {
    try {
        const questions = await questionModel.find({ "status": true })
        res.json(questions)
    }
    catch (err) {
        res.send(err)
    }
}


//gets all unanswered questions
const unansweredQuestions = async (req, res) => {
    try {
        const questions = await questionModel.find({ "status": false })
        res.json(questions)

    }
    catch (err) {
        res.send(err)
    }
}



//answering a question
const answerQ = async (req, res) => {
    try {
        const update = await questionModel.updateOne(
            { _id: req.params.qid },
            { $push: { answers: req.body.answers } ,$set:{status:true}}
        );
        res.json(update);
    } catch (err) {
        res.send(err);
    }
};


//Commenting
//Commenting on a question
const commentQ = async (req, res) => {
    try {
        const update = await questionModel.updateOne(
            { _id: req.params.qid },
            { $push: { comments: req.body.comments } }
        );
        res.json(update);
    } catch (err) {
        res.send(err);
    }
};


//commenting on an answer, qid= question id and aid is answer id
const commentA = async (req, res) => {
    
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
};



//upvoting
//upvoting question
const upvoteQ =  async(req, res) => {
    const update = await questionModel.updateOne({_id:req.params.qid},{$inc:{upvotes:1}})
    res.json(update)
  };


//upvoting answer
const upvoteA= async (req, res) => {
    try {
      const update = await questionModel.updateOne(
        { _id: req.params.qid },
        { $inc: { 'answers.$[j].upvotes':1 } },
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
  };


//exporting
module.exports = { postQuestion, allQuestions, answeredQuestions, unansweredQuestions, answerQ, commentQ, commentA,upvoteQ,upvoteA}