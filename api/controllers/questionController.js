const asyncHandler = require('express-async-handler')  // the function of async handler here is to handle errors in async functions. https://www.npmjs.com/package/express-async-handler
const elastic = require('./elasticController')
// import the models

const questionModel = require('../models/questionModel')
const userModel = require('../models/userModel');
const e = require('express');
//-------------------------------------------------------------------------------------------------------------------------------------

//post questions
const postQuestion = asyncHandler(async (req, res) => {
  const question = new questionModel({
    user_ID: req.user_ID,
    body: req.body.body,
    subject: req.body.subject
    //reason I didn't initialise comment or answer is because it used to create a default answer and comment
  });
  await question
    .save()
    .then(async (data) => {
      //automatic indexing of  question whenever it is posted
      elastic.indexDoc(data.body, data._id)
      await userModel.updateOne(
        { user_Id: req.user_ID }, // this line is to find the question with the id
        { $push: { asked_questions: data._id } }
      );
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
  await questionModel.find().where("hidden").equals(false).sort({"upvotes":-1}).then((data) => {
    res.json(data)
  }).catch((err) => res.send(err))
})


//gets only answered questions along with answers
const answeredQuestions = asyncHandler(async (req, res) => {
  await questionModel.find({ "status": true, "hidden": false }).sort({"upvotes":-1}).then((data) => {
    res.json(data)
  }).catch((err) => {
    res.send(err)
  })
})


//gets all unanswered questions
const unansweredQuestions = asyncHandler(async (req, res) => {
  await questionModel.find({ "status": false, "hidden": false }).sort({"upvotes":-1}).then((data) => {
    res.json(data)
  }).catch((err) => {
    res.send(err)
  })
})



//answering a question
const answerQ = asyncHandler(async (req, res) => {
  await questionModel.updateOne(
      { _id: req.params.qid }, // this line is to find the question with the id
      { $push: { answers: [{
        "body":req.body.body,
        "user_ID":req.user_ID
      } ]}, $set: { status: true } }).then((data)=>{
        res.json(data)
      }).catch((err)=>{
        res.send(err)
      })
});


//Commenting
//Commenting on a question
//no point of keeping track of comments
//this  is because we keep track of  upvotes so that it cannot happen twice .. so no point of comments
const commentQ = asyncHandler(async (req, res) => {
  console.log(req.body.body)
  await questionModel.updateOne(
      { _id: req.params.qid },
      { $push: { comments: [{
        "body":req.body.body,
        "user_ID":req.user_ID
      }] } }
    ).then((data)=>{
      res.json(data)
    }).catch((err)=>res.send(err))
    
});


//commenting on an answer, qid= question id and aid is answer id
const commentA = asyncHandler(async (req, res) => {
      await questionModel.updateOne(
      { _id: req.params.qid },
      { $push: { 'answers.$[j].comments': [
        {
          "body":req.body.body,
          "user_ID":req.user_ID
        }
      ] } },// j is the index of the answer in the array
      {
        arrayFilters: [ // arrayFilters is used to specify which elements to update in the array
          {
            "j._id": req.params.aid
          }
        ]
      }
    ).then((data)=>res.json(data))
    .catch ((err) => res.send(err))
});



//upvoting
//upvoting question
const upvoteQ = asyncHandler(async (req, res) => {
  const um = await userModel.findOne().where("user_ID").equals(req.user_ID).exec()
  //ensure each user can upvote only once
  if (um.upvoted_questions.filter(elm => elm['questionID'] === req.params.qid).length >= 1) {
    console.log("Already upvoted question")
    res.json({ "message": "Already upvoted" })
  }
  else {
    await questionModel.updateOne({ _id: req.params.qid }, { $inc: { upvotes: 1 } }).then(async (data) => {
      const temp = um.upvoted_questions.concat([{ "questionID": req.params.qid }])
      um.upvoted_questions = temp
      await um.save()
      res.json(data)
    })
  }
})



//upvoting answer
const upvoteA = asyncHandler(async (req, res) => {
  const um = await userModel.findOne().where("user_ID").equals(req.user_ID).exec()
  //ensures each user can upvote only once
  if (um.upvoted_answers.filter(elm => elm.answerID === req.params.aid).length >= 1) {
    console.log("Already upvoted answer")
    res.json({ "message": "Already upvoted" })
  }
  else {
    await questionModel.updateOne(
      { _id: req.params.qid },
      { $inc: { 'answers.$[j].upvotes': 1 } },// $inc is used to increment the value of a field
      {
        arrayFilters: [
          {
            "j._id": req.params.aid
          }
        ]
      }
    ).then(async (data) => {
      const temp = um.upvoted_answers.concat([{ "questionID": req.params.qid, "answerID": req.params.aid }])
      um.upvoted_answers = temp
      await um.save()
      res.json(data);
    }).
      catch((err) =>
        res.send(err));
  }
}
);





//hiding stuff
//hiding question
const hideQ = asyncHandler(async (req, res) => {
  elastic.deleteDoc(req.params.qid)
  await questionModel.updateOne({ _id: req.params.qid }, { $set: { hidden: true } }).then((data)=>res.json(update)
  ).catch((err)=>res.send(err))
  
});



//best to delete them than hide
//hiding answer
const hideA = asyncHandler(async (req, res) => {

    await questionModel.updateOne(
      { _id: req.params.qid },
      { $set: { 'answers.$[j].hidden': true } },
      {
        arrayFilters: [
          {
            "j._id": req.params.aid
          }
        ]
      }
    ).then((data)=>res.json(update))
    .catch ((err)=>
    res.send(err))
});

//
//hiding comment
const hideC = asyncHandler(async (req, res) => {
  try {
    const update = await questionModel.updateOne(
      { _id: req.params.qid },
      { $set: { 'comments.$[j].hidden': true } },
      {
        arrayFilters: [
          {
            "j._id": req.params.cid
          }
        ]
      }
    );
    res.json(update);
  } catch (err) {
    res.send(err);
  }
});


//hiding comment inside an answer
const hideAC = asyncHandler(async (req, res) => {
  try {
    const update = await questionModel.updateOne(
      { _id: req.params.qid },
      {
        $set: {
          'answers.$[j].comments.$[i].hidden': true
        }
      },
      {
        arrayFilters: [
          {
            "j._id": req.params.aid
          },
          {
            "i._id": req.params.cid
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
module.exports = { postQuestion, allQuestions, answeredQuestions, unansweredQuestions, answerQ, commentQ, commentA, upvoteQ, upvoteA, hideQ, hideA, hideC, hideAC }