const refreshUser = require("../controllers/userController");
const jwt = require("jsonwebtoken");


const verifyRoles = (...allowedRoles) =>{
    return(req,res,next)=>{
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader === 'undefined'){
            return res.sendStatus(401)
        }
        const bearer = bearerHeader.split(' ')
        const accessToken = bearer[1]
        console.log("Access Token is : %s",accessToken);
        const cookie = req.cookies
        console.log("Cookie is : %s",cookie);
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    //if token expired
                    console.log("The acess token has expired");
                    refreshUser(req.cookies)
                    verifyRoles(...allowedRoles)
                }
                else{
                    // if token not expired
                    console.log("Access token is valid");
                    const role = decoded.role;
                    console.log("Role is : %s",role);
                    const Roles = [...allowedRoles]
                    const result =  Roles.includes(role)
                    console.log("Result is : %s",result);
                    if(!result){
                        console.log("Not enough permissions")
                        return res.sendStatus(401)
                    }
                }
            }
        )
        console.log("We will now proceed");
        next()
    }
}
//error is coming because I have not defined req.roles as an array
module.exports={verifyRoles }