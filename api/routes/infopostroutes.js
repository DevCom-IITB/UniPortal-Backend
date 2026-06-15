const express = require("express");
const router = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const {
  postinfopost,
  getinfopostAd,
  getinfopostStu,
  hideinfopost,
  editinfopost,
  deleteinfopost,
} = require("../controllers/infopostControllers");

router
  .route("/post")
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), postinfopost);
router
  .route("/get")
  .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), getinfopostAd);
router
  .route("/getStu")
  .get(verifyRoles(ROLES_LIST.STUDENT, ROLES_LIST.ISMP), getinfopostStu);
router
  .route("/hide/:id")
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), hideinfopost);
router
  .route("/edit/:id")
  .patch(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), editinfopost);
router
  .route("/delete/:id")
  .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP), deleteinfopost);

module.exports = router;
