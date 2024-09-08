const Problem = require('../models/problem');

exports.reportProblem = async (req, res) => {
    const { description } = req.body;
    const problem = new Problem({ user_id: req.user.user_id, description });
    await problem.save();
    res.status(201).send({ message: 'Problem reported successfully' });
};

exports.getProblems = async (req, res) => {
    const problems = await Problem.find({ user_id: req.user.user_id });
    res.status(200).send(problems);
};
