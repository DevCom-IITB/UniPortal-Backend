const asyncHandler = require('express-async-handler')

const infopostModel = require('../models/infopostModel')


const postinfopost = asyncHandler(async (req, res) => {
    if(!req.body.body){   //need to check the user as smp also
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    const infopost = new infopostModel({
        body: req.body.body,
        urls: req.body.urls
    });
    await infopost
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});




const getinfopost = asyncHandler(async(req,res)=>{
    try{
        const infopost = await infopostModel.find();
        res.json(infopost);
    }
    catch(err){
        res.json({message:err});
    }
})


module.exports ={postinfopost,getinfopost};