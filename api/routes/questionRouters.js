const express = require("express");
const router = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
//import the endpoint functions
const {
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
  hideAC,
  hideC,
} = require("../controllers/questionController");
// const { uploadImage } = require("../controllers/imageController");

//all the routings
router
  .route("/")
  .get(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    allQuestions
  );
router
  .route("/post")
  .post(verifyRoles(ROLES_LIST.STUDENT, ROLES_LIST.Admin), postQuestion);
router
  .route("/myQ")
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    MyQuestions
  );
router
  .route("/otherQ")
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    OtherQuestions
  );
router
  .route("/answeredQ")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    answeredQuestions
  );
router
  .route("/unansweredQ")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    unansweredQuestions
  );
router
  .route("/answerQ/:qid")
  .patch(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    answerQ
  );
router
  .route("/commentQ/:qid")
  .patch(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    commentQ
  );
router
  .route("/commentA/:qid/:aid")
  .patch(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT),
    commentA
  );
router
  .route("/upvoteQ/:qid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.STUDENT), upvoteQ);
router
  .route("/upvoteA/:qid/:aid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.STUDENT), upvoteA);
router
  .route("/hideQ/:qid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), hideQ);
router
  .route("/hideA/:qid/:aid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), hideA);
router
  .route("/hideC/:qid/:cid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), hideC);
router
  .route("/hideAC/:qid/:aid/:cid")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), hideAC);

module.exports = router;
