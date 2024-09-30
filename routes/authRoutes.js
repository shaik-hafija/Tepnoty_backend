const express = require('express');
const { signup, login, getProfile, editProfile, deleteProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { reportFeedback,getFeedback } = require('../controllers/feedbackController');  // Correctly import
const { sendOtp, verifyOtp, resetPassword } = require('../controllers/resetPasswordController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/edit', authMiddleware, editProfile);
router.delete('/profile/delete', authMiddleware, deleteProfile);
router.post('/feedback', authMiddleware, reportFeedback);  // Use the imported function
router.get('/get_feedback', authMiddleware, getFeedback);
router.post('/reset-password/send-otp',sendOtp); // Only authenticated users
router.post('/reset-password/verify-otp',  verifyOtp);
router.post('/reset-password/new-password', resetPassword);

module.exports = router;
