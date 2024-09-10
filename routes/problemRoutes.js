const express = require('express');
const { reportProblem, getProblems } = require('../controllers/problemController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to report a problem (POST /report-problem/:user_id)
router.post('/report-problem', authMiddleware, reportProblem);

// Route to get problems for a specific user (GET /problems/:user_id)
router.get('/get_problems', authMiddleware, getProblems);

module.exports = router;
