
const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next) => {

    const userHeader = req.headers.authorization || req.headers.Authorization
    if (!userHeader?.startsWith('Bearer ')) {
        console.log("😂❤❤❤🤣😊😊🤦‍♂️🤷‍♀️👌🤦‍♀️🤦‍♀️");
        
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = userHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
             
             
            if (err) return res.status(403).json({ message: 'Forbidden' })
               
           
            req.user = decoded

            
            // if (!decoded.confirm )
            //     return res.status(403).json({ message: 'Forbidden' })

            next()
        }
    )
}
module.exports = verifyJWT