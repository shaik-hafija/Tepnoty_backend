const express = require('express');
const { signup, login, getProfile, editProfile, deleteProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { reportFeedback,getFeedback } = require('../controllers/feedbackController');  // Correctly import

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/edit', authMiddleware, editProfile);
router.delete('/profile/delete', authMiddleware, deleteProfile);
router.post('/feedback', authMiddleware, reportFeedback);  // Use the imported function
router.get('/get_feedback', authMiddleware, getFeedback);

module.exports = router;
