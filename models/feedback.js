const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id : String,
    description: String,
   // URL or path to the video file
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
