const asyncHandler = require("express-async-handler");
const questionModel=require("../models/questionModel");
const infopostModel=require("../models/infopostModel");


const getContent = asyncHandler(async (req, res) => {
    const { type, tag } = req.body;
    console.log(type,tag)
  
    if (!type || !tag) {
      return res.status(400).json({ message: "Type and tag are required" });
    }
  
    try {
      if (type==="question"){
        const content = await questionModel.find({ tag: tag, hidden: false }).sort({ upvotes: -1 });
        res.json(content);
    }
      else if (type==="infopost"){
        const content = await infopostModel.find({ tag: tag, hidden: false }).sort({ asked_At: -1 });
        res.json(content);
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error occurred while fetching content" });
    }
  });

module.exports={getContent};
  