const jwt = require("jsonwebtoken");


const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        console.log("We are in verifyRoles");
        const bearerHeader = req.headers['authorization']
        let accessToken = ''
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            accessToken = bearer[1]
        }
        console.log("Access Token is : %s", accessToken);
        const cookie = req.cookies
        console.log("refresh token is : %s", cookie.jwt);
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    //if token expired
                    res.status(403).json({ message: "Access token expired" })
                }
                else{
                console.log("Access token is valid");
                const role = decoded.role;
                console.log("Role is : %s", role);
                const Roles = [...allowedRoles]
                const result = Roles.includes(role)
                console.log("Result is : %s", result);
                if (!result) {
                    console.log("Not enough permissions")
                    return res.sendStatus(401)
                }
                console.log("We will now proceed");
                next()
                }
            }
        )

    }
}




//error is coming because I have not defined req.roles as an array
module.exports = { verifyRoles }