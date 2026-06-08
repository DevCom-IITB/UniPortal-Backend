const express=require("express");
const router=express.Router();
const {getContent}=require("../controllers/tagController");
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/") 
  .post(
    verifyRoles(
      ROLES_LIST.Admin,
      ROLES_LIST.SMP,
      ROLES_LIST.STUDENT,
      ROLES_LIST.ISMP
    ),
    getContent
  );

module.exports=router;
