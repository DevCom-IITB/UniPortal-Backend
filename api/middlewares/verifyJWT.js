require('dotenv').config()
const jwt = require('jsonwebtoken')


const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token ==null) return res.sendStatus(401)
  
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
      if(err) {
        return res.sendStatus(403)
    }
      req.user_ID = decoded.user_ID
      req.roles =  decoded.roles
      next()
    })
  }


  module.exports=authenticateToken