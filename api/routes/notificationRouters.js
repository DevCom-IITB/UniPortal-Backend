const express = require('express');
const router = express.Router();
const { verifyRoles } = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const { getNotificationsByStudent } = require('../controllers/notificationController');

// Route to get all notifications of a particular student
router
    .route("/get/:studentId")
    .get(verifyRoles(ROLES_LIST.STUDENT, ROLES_LIST.SMP, ROLES_LIST.Admin), getNotificationsByStudent);

module.exports = router;
