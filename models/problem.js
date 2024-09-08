const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
