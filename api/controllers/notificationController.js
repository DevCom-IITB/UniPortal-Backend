const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();
const notificationModel = require("../models/notificationModel");
const User = require('../models/userModel');
const path = require("path");
const ROLES_LIST = require("../../config/roles_list");

//Function for creating notifications
const createNotification = asyncHandler(async (senderid, recipientlist, contentid, content, isquestion) => {
  try {
    const newNotification = new notificationModel({
      senderid: senderid,
      recipientlist: recipientlist,
      contentid: contentid,
      content: content,
      isquestion: isquestion
    });
    await newNotification.save();
    console.log("Notification created:", newNotification);


    return newNotification;
  } catch (err) {
    throw new Error("An error occurred while creating notification" + err.message);
  }
});


// Function to get all notifications of a particular student
const getNotificationsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const notifications = await notificationModel.find({ recipientlist: studentId });

    res.json({ notifications });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ error: 'An error occurred while retrieving notifications' });
  }
};

module.exports = {
  createNotification,
  getNotificationsByStudent
};
