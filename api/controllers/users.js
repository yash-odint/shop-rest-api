const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.user_signup_post = (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        "email": req.body.email,
        "password": req.hashedPassword
    });
    user.save()
    .then((result) => {
        res.status(201).json({
            message: "user created successfully"
        });
    })
    .catch((err) => {
        res.json({message: err})
    });
}

exports.user_login_post = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then((users) => {
            if(users.length < 1){
                return res.status(401).json({
                    "message": "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        "message": "Auth failed"
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id
                        }, 
                        process.env.JWT_SECRET_KEY,
                        {
                          expiresIn: "1h"  
                        }
                    );
                    return res.status(201).json({
                        "message": "Auth Successfull",
                        "token" : token
                    });
                }
                res.status(401).json({
                    "message": "Auth Failed"
                });

            });

        })
        .catch((err) => {
            res.status(401).json({
                "message": "Auth Failed"
            });
        });
}

exports.user_delete = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({_id: id})
        .exec()
        .then((result) => {
            res.status(200).json({
                "Message": "user deleted"
            });
        })
        .catch((err) => {
            res.json({message: err})
        });
}
