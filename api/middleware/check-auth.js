const jwt = require('jsonwebtoken');
require("dotenv").config();

function auth(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = decoded;
        next();
    }
    catch(error){
        res.status(400).json({
            message: "Auth failed"
        });
    }
}

module.exports = auth;