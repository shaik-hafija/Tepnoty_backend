const express = require('express');
const { signup, login, getProfile, editProfile, deleteProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { reportFeedback,getFeedback } = require('../controllers/feedbackController');  // Correctly import
const { sendOtp, verifyOtp, resetPassword } = require('../controllers/resetPasswordController');
const {blockUser,unblockUser,getBlockedUsers,followUser,unfollowUser,getFollowersAndFollowing}=require('../controllers/blockController');

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
router.post('/block', authMiddleware, blockUser);
router.post('/unblock', authMiddleware, unblockUser);
router.get('/blocked-users', authMiddleware, getBlockedUsers);

router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.get('/followers-following', authMiddleware, getFollowersAndFollowing);


module.exports = router;
