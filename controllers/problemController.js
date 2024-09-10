const Problem = require('../models/problem');

// Report a problem
exports.reportProblem = async (req, res) => {
    const { description, image, video } = req.body; 
    // const { user_id } = req.params; 
    const user_id = req.user._id;

    console.log("Received user_id:", user_id); // Debugging line

    try {
        const problem = new Problem({
            user_id: user_id,
            description,
            image, 
            video
        });
        console.log(problem)
        await problem.save();
        res.status(201).send({ message: 'Problem reported successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error reporting problem', error: error.message });
    }
};

// Get problems for a specific user
exports.getProblems = async (req, res) => {
    const { user_id } = req.params; // Get user_id from route parameters

    try {
        const problems = await Problem.find({ user_id: mongoose.Types.ObjectId(user_id) });
        res.status(200).send(problems);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching problems', error: error.message });
    }
};
