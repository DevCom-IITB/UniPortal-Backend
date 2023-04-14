const express = require('express')
const router = express.Router()

//import the endpoint functions
const  { postQuestion , answeredQuestion, unansweredQuestion} =require('../controllers/questionController')


router.route('/post').post(postQuestion);
router.route('/answered').get(answeredQuestion);
router.route('/unanswered').get(unansweredQuestion);




module.exports = router;