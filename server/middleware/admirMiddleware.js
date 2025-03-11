const User=require("../models/User")
const admirMiddleware=(req,res,next)=>
    {
        req.user = decoded
        console.log(decoded)
        if(decoded.roles!=Admin)
            {
                return res.status(403).json({ message :'Forbidden' })
            }
            next()
    }
    module.exports=admirMiddleware