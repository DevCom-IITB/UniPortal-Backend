const verifyRoles = (...allowedRoles) =>{
    return(req,res,next)=>{
        if(!req?.roles) res.sendStatus(401)
        console.log(req.roles)
        const rolesArray = [...allowedRoles]
        console.log(rolesArray)
        const result =  req.roles.map(role=>rolesArray.includes(role)).find(val => val === true)
        console.log(result)
        
        if(!result){
            console.log("Not enough permissions")
            return res.sendStatus(401)
        }

        next()
    }
}
//error is coming because I have not defined req.roles as an array
module.exports={verifyRoles }