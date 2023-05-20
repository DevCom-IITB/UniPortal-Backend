const mongoose = require("mongoose");

//imageSchema
const imageSchema = mongoose.Schema({
  filename: { type: String, default: "" },
  contentType: { type: String, default: "" },
  path: { tytpe: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = imageSchema;

const imageModel = mongoose.model("imageModel", imageSchema);

module.exports = imageModel;
