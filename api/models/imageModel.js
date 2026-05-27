const mongoose = require("mongoose");

//imageSchema
const imageSchema = mongoose.Schema({
  filename: { type: String, default: "" }, //Stores the name of the file (e.g., image-171656.jpg) as a string.  
  contentType: { type: String, default: "" },//Stores the MIME type of the file (e.g., image/jpeg), indicating the file type.
  path: { tytpe: String },//Stores the file path where the image is stored on the server.
  uploadedAt: { type: Date, default: Date.now },//Stores the exact date and time when the file was uploaded.
});

module.exports = imageSchema;//Exports the schema so it can be used in other files (like questionModel.js) to define how image data should be structured in the database.

const imageModel = mongoose.model("imageModel", imageSchema);

module.exports = imageModel;
