const mongoose = require("mongoose");//This imports the Mongoose library, which is the Object Data Modeling (ODM) tool used to interact with MongoDB.

//schema for infopost
const infopostSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  body: { type: String, required: true },
  urls: { type: String, default: "" },
  //Allows the post to include external links (like registration forms or official IITB websites). It defaults to an empty string if no link is provided

  hidden: { type: Boolean, default: false },
  //If set to true, the post exists in the database but is hidden from the students' feed. This is useful for archiving old posts or drafting new ones

  images: [{ type: String }],
  //An Array of Strings that stores the paths or filenames of images associated with the post.

  asked_At: { type: Date, default: Date.now },
  //Stores the exact date and time when the post was created. It defaults to the current server time if not specified
});

const infopostModel = mongoose.model("infopostModel", infopostSchema);

module.exports = infopostModel;
