const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    description: String,
    image: String, // URL or path to the image file
    video: String, // URL or path to the video file
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
