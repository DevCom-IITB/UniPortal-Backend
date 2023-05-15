const mongoose = require("mongoose");
 
//import imageSchema

const imageModel = require('../models/imageModel')


//schema for infopost

const infopostSchema = mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        body:{type:String, required:true},
        urls:{type:String,default:""},
        image:{type:mongoose.Schema.Types.ObjectId, ref :imageModel}
    }
)

const infopostModel = mongoose.model("infopostModel",infopostSchema);

module.exports = infopostModel;