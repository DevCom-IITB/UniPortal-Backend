const mongoose = require("mongoose");

//imageSchema
const imageSchema = mongoose.Schema({
  filename: { type: String },
  img: {
    contentType: { type: String },
    data: Buffer,
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = imageSchema;

const imageModel = mongoose.model("imageModel", imageSchema);

module.exports = imageModel;
