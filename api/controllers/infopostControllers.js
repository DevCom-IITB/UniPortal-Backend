const asyncHandler = require("express-async-handler");

const infopostModel = require("../models/infopostModel");

const postinfopost = asyncHandler(async (req, res) => {
  if (!req.body.body) {
    //need to check the user as smp also
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  try {
    const infopost = new infopostModel({
<<<<<<< HEAD
      body: req.body.body,
      urls: req.body.urls,
=======
        body: req.body.body,
        urls: req.body.urls
>>>>>>> 7425d823decc524beab5ce30db5b95b6c67c9beb
    });
    await infopost.save();
    res.json({ message: "Posted Succesfully" });
  } catch (error) {
    res.json({ message: "Error uploading image" });
  }
});

const getinfopost = asyncHandler(async (req, res) => {
  try {
    const infopost = await infopostModel.find();
    res.json(infopost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = { postinfopost, getinfopost };
