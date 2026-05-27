require("dotenv").config();
const mongoose = require("mongoose");
const questionModel = require("./api/models/questionModel");
const infopostModel = require("./api/models/infopostModel");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const questions = await questionModel.find().lean();
  console.log("Questions:");
  questions.forEach(q => console.log(q.body, q.hidden));
  
  const infoposts = await infopostModel.find().lean();
  console.log("Infoposts:");
  infoposts.forEach(p => console.log(p.body, p.hidden));
  
  process.exit(0);
}
run();
