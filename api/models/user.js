const mongoose = require('mongoose');
// const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {type: String, required: true}
});

module.exports = mongoose.model("User", userSchema);