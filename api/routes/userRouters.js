const express = require("express");
const router = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  SMPLogin,
} = require("../controllers/userController");

router.route("/register").post( registerUser);
router.route("/login").post(loginUser);
router.route("/smplogin").post(SMPLogin);
router.route("/refresh").put(refreshUser);
router.route("/logout").post(logoutUser);

module.exports = router;
