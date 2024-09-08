const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: String,
    name: String,
    gender: String,
    dob: Date,
    username: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('User', userSchema);
