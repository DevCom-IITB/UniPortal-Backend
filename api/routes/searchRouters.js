const express = require("express");
const router = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const {
  searchQuestions,
  getQuestionById,
} = require("../controllers/searchController");

const allRoles = [
  ROLES_LIST.Admin,
  ROLES_LIST.SMP,
  ROLES_LIST.STUDENT,
  ROLES_LIST.ISMP,
];

router.route("/").get(verifyRoles(...allRoles), searchQuestions);
router.route("/question/:qid").get(verifyRoles(...allRoles), getQuestionById);

module.exports = router;
