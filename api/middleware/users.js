const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.duplicateChecker = (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then((user)=>{
            if(user.length >= 1){
                return res.status(409).json({
                    message: "User already exists"
                });
            } else{
                next();
            }
        });
}

exports.passwordHasher = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        req.hashedPassword = hash;
        next();
    });
}