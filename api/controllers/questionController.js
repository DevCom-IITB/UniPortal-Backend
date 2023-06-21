const asyncHandler = require("express-async-handler"); // the function of async handler here is to handle errors in async functions. https://www.npmjs.com/package/express-async-handler
const elastic = require("./elasticController");
const e = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
// multer middleware for handling uploading images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../html/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.filename}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// import the models
const questionModel = require("../models/questionModel");
const userModel = require("../models/userModel");
const imageModel = require("../models/imageModel");

//-------------------------------------------------------------------------------------------------------------------------------------

//post questions
const postQuestion = asyncHandler(async (req, res) => {
  try {
    const qID = new mongoose.Types.ObjectId();
    //upload a max 0f 10 images with a question
    upload.array("images", 10)(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json(req.body);
      }
      //get the images from request
      const images = req.files;
      console.log('images :', images);
      //initiliaze ann array and store the id of the images
      const savedImages = [];
      if(images){
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const newImage = new imageModel({
            filename: image.filename,
            path: image.path,
          });
          await newImage.save();
          savedImages.push(image.filename);
        }
      }
      
      //save the images to the question model

      body = req.body;
      console.log('body :', body);
      //finding user
      const um = await userModel.findOne({ user_ID: body.user_ID });
      console.log('user found', um);
      //creating question
      await questionModel
        .create({
          user_ID: body.user_ID,
          user_Name: um.name,
          body: body.body,
          images: savedImages,
          _id: qID,
          //reason I didn't initialise comment or answer is because it used to create a default answer and comment
        })
        .then(async (data) => {
          //automatic indexing of  question whenever it is posted
          // elastic.indexDoc(data.body, data._id, res);
          // console.log("we have indexed the question");
          //inserting asked question id to user model
          const temp = um.asked_questions.concat([
            { questionID: data._id.valueOf() },
          ]);
          um.asked_questions = temp;
          await um.save();

          res.json(data);
        });
    });
  } catch (err) {
    res.json({ message: "error" });
  }
});

//answers
// get all questions
// try to implement that one request you send a limited number of questions and then when you scroll down you send another request with the next set of questionss
const allQuestions = asyncHandler(async (req, res) => {
  await questionModel
    .find()
    .populate("images")
    .where("hidden")
    .equals(false)
    .sort({ upvotes: -1 })
    .then((data) => {
      //not sending hidden comments
      let temp = [];
      data.forEach((elm) => {
        temp = [];
        elm.comments.forEach((em) => {
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.comments = temp;
      });
      //not sending hidden answers and hidden comments within answers
      data.forEach((elm) => {
        temp = [];
        elm.answers.forEach((em) => {
          let temp1 = [];
          em.comments.forEach((emm) => {
            if (emm.hidden == false) temp1.push(emm);
          });
          em.comments = temp1;
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.answers = temp;
      });

      res.json(data);
    })
    .catch((err) => res.send(err));
});

//gets all my asked questions
const MyQuestions = asyncHandler(async (req, res) => {
  await questionModel
    .find({ user_ID : req.body.user_ID, hidden: false })
    .sort({ upvotes: -1, asked_At: -1 })
    .then((data) => {
      //not sending hidden comments
      let temp = [];
      data.forEach((elm) => {
        temp = [];
        elm.comments.forEach((em) => {
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.comments = temp;
      });
      //not sending hidden answers and hidden comments within answers
      data.forEach((elm) => {
        temp = [];
        elm.answers.forEach((em) => {
          let temp1 = [];
          em.comments.forEach((emm) => {
            if (emm.hidden == false) temp1.push(emm);
          });
          em.comments = temp1;
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.answers = temp;
      });

      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//gets all not my questions
const OtherQuestions = asyncHandler(async (req, res) => {
  await questionModel
    .find({ user_ID : { $ne : req.body.user_ID }, hidden: false })
    .sort({ upvotes: -1, asked_At: -1 })
    .then((data) => {
      //not sending hidden comments
      let temp = [];
      data.forEach((elm) => {
        temp = [];
        elm.comments.forEach((em) => {
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.comments = temp;
      });
      //not sending hidden answers and hidden comments within answers
      data.forEach((elm) => {
        temp = [];
        elm.answers.forEach((em) => {
          let temp1 = [];
          em.comments.forEach((emm) => {
            if (emm.hidden == false) temp1.push(emm);
          });
          em.comments = temp1;
          if (em.hidden === false) {
            console.log(em);
            temp.push(em);
          }
        });
        elm.answers = temp;
      });

      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//gets only answered questions along with answers
const answeredQuestions = asyncHandler(async (req, res) => {
  await questionModel
    .find({ status: true })
    .sort({ upvotes: -1, asked_At: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//gets all unanswered questions
const unansweredQuestions = asyncHandler(async (req, res) => {
  await questionModel
    .find({ status: false })
    .sort({ upvotes: -1, asked_At: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//answering a question
const answerQ = asyncHandler(async (req, res) => {
  try {
    upload.array("images", 10)(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "An error occurred while uploading the image" });
      }
      //get the images from request
      const images = req.files;
      console.log('images', images);
      //initiliaze ann array and store the id of the images
      const savedImages = [];
      if(images){
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const newImage = new imageModel({
            filename: image.filename,
            path: image.path,
          });
          await newImage.save();
          savedImages.push(image.filename);
        }
      }
      
      const body = req.body['answers'];
      console.log('body', body);
      const um = await userModel.findOne({ user_ID: body.user_ID });
      console.log('user model', um);
      let verified = false;
      if(um.role === 5980){
        verified = true;
      }
      await questionModel
        .updateOne(
          { _id: req.params.qid }, // this line is to find the question with the id
          {
            $push: {
              answers: [
                {
                  body: body.body,
                  user_ID: body.user_ID,
                  user_Name: um.name,
                  images: savedImages,
                  verified: verified,
                },
              ],
            },
            $set: { status: true },
          }
        )
        .then((data) => {
          res.json(data);
        });
    });
  } catch (err) {
    res.send(err);
  }
});

//Commenting
//Commenting on a question
//no point of keeping track of comments
//this  is because we keep track of  upvotes so that it cannot happen twice .. so no point of comments
const commentQ = asyncHandler(async (req, res) => {
  try {
    const cID = new mongoose.Types.ObjectId();
    const body = req.body['comments'];
    const um = await userModel.findOne({ user_ID: body.user_ID });
    console.log('user model', um);
    await questionModel
      .updateOne(
        { _id: req.params.qid },
        {
          $push: {
            comments: [
              {
                _id: cID,
                body: body.body,
                user_ID: body.user_ID,
                user_Name: um.name,
              },
            ],
          },
        }
      )
      .then(async (data) => {
        console.log(cID.valueOf());
        //inserting posted comment id to user model

        const temp = um.question_comments.concat([
          { questionID: req.params.qid, commentID: cID.valueOf() },
        ]);
        um.question_comments = temp;
        await um.save();
        res.json(data);
      });
  } catch (err) {
    console.log(err);
    res.json({ message: "error" });
  }
});

//commenting on an answer, qid= question id and aid is answer id
const commentA = asyncHandler(async (req, res) => {
  try {
    const cID = new mongoose.Types.ObjectId();
    const body = req.body['answers']['comments'];
    const um = await userModel
      .findOne()
      .where("user_ID")
      .equals(body.user_ID)
      .exec();
    await questionModel
      .updateOne(
        { _id: req.params.qid },
        {
          $push: {
            "answers.$[j].comments": [
              {
                _id: cID,
                body: body.body,
                user_ID: body.user_ID,
                user_Name: um.name,
              },
            ],
          },
        }, // j is the index of the answer in the array
        {
          arrayFilters: [
            // arrayFilters is used to specify which elements to update in the array
            {
              "j._id": req.params.aid,
            },
          ],
        }
      )
      .then(async (data) => {
        //inserting posted comments in user model
        const temp = um.answer_comments.concat([
          {
            questionID: req.params.qid,
            answerID: req.params.aid,
            commentID: cID.valueOf(),
          },
        ]);
        um.answer_comments = temp;
        await um.save();
        res.json(data);
      });
  } catch (err) {
    res.send(err);
  }
});

//upvoting
//upvoting question
const upvoteQ = asyncHandler(async (req, res) => {
  const um = await userModel
    .findOne()
    .where("user_ID")
    .equals(req.body.user_ID)
    .exec();
  //ensure each user can upvote only once
  let upvote_val = 1;
  if (
    um.upvoted_questions.filter((elm) => elm["questionID"] === req.params.qid)
      .length >= 1
  ) {
    console.log("Already upvoted question");
    console.log('unupvoting');
    upvote_val = -1;
  }
    await questionModel
      .updateOne({ _id: req.params.qid }, { $inc: { upvotes: upvote_val } })
      .then(async (data) => {
        let temp;
        if(upvote_val === -1){
          temp = um.upvoted_questions.filter((elm) => elm["questionID"] !== req.params.qid);
          console.log('removing upvote');
        }
        else{
          temp = um.upvoted_questions.concat([
            { questionID: req.params.qid },
          ]);
          console.log('adding upvote');
        }
        um.upvoted_questions = temp;
        await um.save();
        res.json({ val : upvote_val });
      });
});

//upvoting answer
const upvoteA = asyncHandler(async (req, res) => {
  const um = await userModel
    .findOne()
    .where("user_ID")
    .equals(req.body.user_ID)
    .exec();
  //ensures each user can upvote only once
  let upvote_val = 1;
  if (
    um.upvoted_answers.filter((elm) => elm.answerID === req.params.aid)
      .length >= 1
  ) {
    console.log("Already upvoted answer");
    console.log('unupvoting');
    upvote_val = -1;
  }
    await questionModel
      .updateOne(
        { _id: req.params.qid },
        { $inc: { "answers.$[j].upvotes": upvote_val } }, // $inc is used to increment the value of a field
        {
          arrayFilters: [
            {
              "j._id": req.params.aid,
            },
          ],
        }
      )
      .then(async (data) => {
        let temp;
        if(upvote_val === -1){
          temp = um.upvoted_answers.filter((elm) => elm.answerID !== req.params.aid);
          console.log('removing upvote');
        }
        else{
          temp = um.upvoted_answers.concat([
            { questionID: req.params.qid, answerID: req.params.aid },
          ]);
          console.log('adding upvote');
        }
        um.upvoted_answers = temp;
        await um.save();
        res.json({ val : upvote_val });
      })
      .catch((err) => res.send(err));
});

//hiding stuff
//hiding question
const hideQ = asyncHandler(async (req, res) => {
  // elastic.deleteDoc(req.params.qid);
  const question = await questionModel.findById(req.params.qid);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const updatedHidden = !question.hidden;

  await questionModel
    .updateOne({ _id: req.params.qid }, { $set: { hidden : updatedHidden } })
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});


//best to delete them than hide
//hiding answer
const hideA = asyncHandler(async (req, res) => {
  const question = await questionModel.findById(req.params.qid);
  console.log('question:', question);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const answerId = req.params.aid;
  const answerIndex = question.answers.findIndex((answer) => answer._id == answerId);
  console.log('Answer index:', answerIndex);


  console.log('Current hidden value:', question.answers[answerIndex].hidden);


  await questionModel
    .updateOne(
      { _id: req.params.qid },
      { $set: { "answers.$[j].hidden": !question.answers[answerIndex].hidden } },
      {
        arrayFilters: [
          {
            "j._id": req.params.aid,
          },
        ],
      }
    )
    .then((data) => {
      console.log("hid answer");
      res.json(update)
    })
    .catch((err) => res.send(err));
});



//
//hiding comment
const hideC = asyncHandler(async (req, res) => {
  const question = await questionModel.findById(req.params.qid);
  console.log('question:', question);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const commentId = req.params.cid;
  const commentIndex = question.comments.findIndex((comment) => comment._id == commentId);
  console.log('Comment index:', commentIndex);

  await questionModel
    .updateOne(
      { _id: req.params.qid },
      { $set: { "comments.$[j].hidden": !question.comments[commentIndex].hidden } },
      {
        arrayFilters: [
          {
            "j._id": req.params.cid,
          },
        ],
      }
    )
    .then((data) => {
      console.log("hid comment");
      res.json(update)
    })
    .catch((err) => res.send(err));
});

//hiding comment inside an answer
const hideAC = asyncHandler(async (req, res) => {
  const question = await questionModel.findById(req.params.qid);
  console.log('question:', question);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const answerId = req.params.aid;
  const answerIndex = question.answers.findIndex((answer) => answer._id == answerId);
  console.log('Answer index:', answerIndex);

  const commentId = req.params.cid;
  const commentIndex = question.answers[answerIndex].comments.findIndex((comment) => comment._id == commentId);
  console.log('Comment index:', commentIndex);

  await questionModel
    .updateOne(
      { _id: req.params.qid },
      { $set: { "answers.$[j].comments.$[i].hidden": !question.answers[answerIndex].comments[commentIndex].hidden } },
      {
        arrayFilters: [
          {
            "j._id": req.params.aid,
          },
          {
            "i._id": req.params.cid,
          },
        ],
      }
    )
    .then((data) => {
      console.log("hid comment");
      res.json(data) 
    })
    .catch((err) => res.send(err));
});

//exporting
module.exports = {
  postQuestion,
  allQuestions,
  MyQuestions,
  OtherQuestions,
  answeredQuestions,
  unansweredQuestions,
  answerQ,
  commentQ,
  commentA,
  upvoteQ,
  upvoteA,
  hideQ,
  hideA,
  hideC,
  hideAC,
};
