const express = require('express')
const router = express.Router()

//import the endpoint functions
const  { postQuestion, allQuestions, answeredQuestions, unansweredQuestions, answerQ, commentQ, commentA,upvoteQ,upvoteA,hideQ,hideA,hideAC,hideC} =require('../controllers/questionController')

//all the routings
router.route('/').get(allQuestions)
router.route('/post').post(postQuestion);
router.route('/answeredQ').get(answeredQuestions);
router.route('/unansweredQ').get(unansweredQuestions);
router.route('/answerQ/:qid').patch(answerQ);
router.route('/commentQ/:qid').patch(commentQ);
router.route('/commentA/:qid/:aid').patch(commentA);
router.route('/upvoteQ/:qid').patch(upvoteQ);
router.route('/upvoteA/:qid/:aid').patch(upvoteA);
router.route('/hideQ/:qid').patch(hideQ)
router.route('/hideA/:qid/:aid').patch(hideA)
router.route('/hideC/:qid/:cid').patch(hideC)
router.route('/hideAC/:qid/:aid/:cid').patch(hideAC)
module.exports = router;
