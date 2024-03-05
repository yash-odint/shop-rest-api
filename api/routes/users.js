const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const usersController = require("../controllers/users");
const userMiddleware = require("../middleware/users");

router.post("/signup", userMiddleware.duplicateChecker, userMiddleware.passwordHasher, usersController.user_signup_post);

router.post("/login", usersController.user_login_post);

router.delete("/:userId", usersController.user_delete);


module.exports = router;