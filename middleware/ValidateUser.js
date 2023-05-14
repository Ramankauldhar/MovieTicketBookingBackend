const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; //the space is important between split(' ')
        //return res.json(token);
        const decode = JWT.verify(token, "webBatch");
        req.userData = decode;
        // return res.json(decode);
        next();
    }
    catch(error){
        res.json({success:false, message:"User Authentication Failed"})
    } 
}