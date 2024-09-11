const Feedback = require('../models/feedback');
// const User=require('../models/user')

// Report a problem
exports.reportFeedback = async (req, res) => {
    const { description } = req.body; 
    const user_id = req.user.user_id;

    console.log("Received user_id:", user_id); // Debugging line

    try {
        const feedback = new Feedback({
            user_id: user_id,
            description: description
        });
        console.log(feedback);
        await feedback.save();
        res.status(201).send({ message: 'Successfully uploaded feedback' });
    } catch (error) {
        res.status(500).send({ message: 'Error uploading feedback', error: error.message });
    }
};

// Get problems for a specific user
exports.getFeedback = async (req, res) => {
    console.log("In Feedback")
    const user_id = req.user.user_id; // Assumes user_id is attached to req.user
    console.log("In get feedback decoded : ",user_id)

    try {
        // Find problems reported by the specific user
        const feedback = await Feedback.find({ user_id });
        res.status(200).send(feedback);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching problems', error: error.message });
    }
};
