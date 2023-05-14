const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//const { getimage } = require("../controllers/imageControllers");

const storage = multer.diskStorage({
  destination: "../upload/images",
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.filename}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

const imageModel = require("../models/imageModel");

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  try {
    const image = imageModel({
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });
    await image.save();
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error uploading image" });
  }
});

//router.route("/get/:id").get(getimage);

module.exports = router;
