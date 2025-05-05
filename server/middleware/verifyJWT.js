
const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next) => {
    console.log(req)
    console.log("***********")
    console.log(res)
    const userHeader = req.headers.authorization || req.headers.Authorization
    if (!userHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = userHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
             console.log("✔✔✔🐱‍🚀🐱‍🚀🐱‍🚀🐱‍👓🐱‍👓🐱‍🐉🐱‍🐉🐱‍💻");
             console.log(err);
             
            if (err) return res.status(403).json({ message: 'Forbidden' })
               
            console.log(decoded);
            console.log("💋💋👏"+req.user);  
            req.user = decoded

            console.log("💋💋👏"+req.user.roles);

            
            // if (!decoded.confirm )
            //     return res.status(403).json({ message: 'Forbidden' })

            next()
        }
    )
}
module.exports = verifyJWT