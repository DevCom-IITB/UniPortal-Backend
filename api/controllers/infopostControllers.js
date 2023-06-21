const asyncHandler = require("express-async-handler");

const infopostModel = require("../models/infopostModel");
const imageModel = require("../models/imageModel");
const path = require("path");
// multer middleware for handling uploading images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../html/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.filename}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

const postinfopost = asyncHandler(async (req, res) => {
  try {
    upload.array("images", 10)(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "An error occurred while uploading the image" });
      }
      //get the images from request
      const images = req.files;
      //initiliaze ann array and store the id of the images
      const savedImages = [];
      if(images){
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const newImage = new imageModel({
            filename: image.filename,
            path: image.path,
          });
          await newImage.save();
          savedImages.push(image.filename);
        }
      }
      const infopost = new infopostModel({
        body: req.body.body,
        url: req.body.urls,
        images: savedImages,
      });
      await infopost.save().then((data) => {
        res.json(data);
      });
    });
  } catch (err) {
    res.json({ message: "error" });
  }
});

const getinfopostAd = asyncHandler(async (req, res) => {
  try {
    const infopost = await infopostModel.find().populate("images").sort({asked_At: -1});
    res.json(infopost);
  } catch (err) {
    res.json({ message: "error" });
  }
});

//function for not sending hidden infoposts
const getinfopostStu = asyncHandler(async (req, res) => {
  try {
    const infopost = await infopostModel.find({ hidden : false }).populate("images").sort({asked_At: -1});
    res.json(infopost);
  } catch (err) {
    res.json({ message: "error" });
  }
});

// a function to hide an infopost
const hideinfopost = asyncHandler(async (req, res) => {
  try {
    const infopost = await infopostModel.findById(req.params.id);
    
    if(!infopost){
      return res.status(404).json({ message: "infopost not found" });
    }

    const updatedHidden = ! infopost.hidden;

    await infopostModel
      .updateOne({ _id: req.params.id },{ $set: { hidden: updatedHidden }})
      .then((data) => res.json(data));

  } catch (err) {
    res.json({ message: "error" });
  }
});

//a function to edit infopost
const editinfopost = asyncHandler(async (req, res) => {
  try {
    console.log('editinfopost');
    const infopost = await infopostModel.findById(req.params.id);
    if(!infopost){
      return res.status(404).json({ message: "infopost not found" });
    }
    console.log('found infopost');
    const body = req.body.body;
    console.log('req: ', req);
    console.log('body: ', body);
    await infopostModel
      .updateOne({ _id: req.params.id },{ $set: { body: body }})
      .then((data) => res.json(data));

  } catch (err) {
    res.json({ message: "error" });
  }
});


module.exports = { postinfopost, getinfopostAd, getinfopostStu, hideinfopost, editinfopost };
