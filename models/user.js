const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    user_id: { type: String, required: true, unique: true }, // Ensure user_id is defined and unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: [{ token: { type: String, required: true } }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
