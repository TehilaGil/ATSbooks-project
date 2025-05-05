const User=require("../models/User")
const admirMiddleware=(req,res,next)=>
    {
        console.log("gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
        console.log("❤😍😍❤"+req.user.roles)
        
        
        // req.user = decoded
        // console.log(decoded);
        // console.log("decoded"+decoded.user)
        if(req.user.roles!="Admin")
            {

                return res.status(403).json({ message :'Forbidden' })
            }
            next()
    }
    module.exports=admirMiddleware