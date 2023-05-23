const asyncHandler = require("express-async-handler");

const infopostModel = require("../models/infopostModel");
const imageModel = require("../models/imageModel");
const path = require("path");
// multer middleware for handling uploading images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
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
        return res
          .status(500)
          .json({ error: "An error occurred while uploading the image" });
      }
      //get the images from request
      const images = req.files;
      //initiliaze ann array and store the id of the images
      const savedImages = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const newImage = new imageModel({
          filename: image.filename,
          path: image.path,
        });
        const savedImage = await newImage.save();
        savedImages.push(savedImage._id);
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

const getinfopost = asyncHandler(async (req, res) => {
  try {
    const infopost = await infopostModel.find().populate("images");
    res.json(infopost);
  } catch (err) {
    res.json({ message: "error" });
  }
});

module.exports = { postinfopost, getinfopost };
