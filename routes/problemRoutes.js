const express = require('express');
const { reportProblem, getProblems } = require('../controllers/problemController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/report-problem', authMiddleware, reportProblem);
router.get('/problems', authMiddleware, getProblems);

module.exports = router;
