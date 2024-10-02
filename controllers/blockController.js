const User = require('../models/user');  // Adjust the path according to your folder structure

exports.blockUser = async (req, res) => {
    try {
        const { user_id_to_block } = req.body;  // Get the ID of the user to block
        console.log(user_id_to_block);
        
        const user = await User.findOne({ user_id: req.user.user_id });  // Get the user who is blocking
        const userToBlock = await User.findOne({ user_id: user_id_to_block });  // Get the user to be blocked

        if (!userToBlock) {
            return res.status(404).send({ message: 'User to block not found' });
        }

        console.log("User ID to block:", userToBlock);

        if (user.blockedUsers.includes(user_id_to_block)) {
            return res.status(400).send({ message: 'User already blocked' });
        }

        user.blockedUsers.push(user_id_to_block);  // Add to blocked list
        await user.save();  // Save the updated user

        res.status(200).send({ message: 'User blocked successfully' });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).send({ message: 'Server error' });
    }
};


exports.unblockUser = async (req, res) => {
    try {
        const { user_id_to_unblock } = req.body;
        const user = await User.findOne({ user_id: req.user.user_id });

        user.blockedUsers = user.blockedUsers.filter(blockedUser => blockedUser !== user_id_to_unblock);
        await user.save();

        res.status(200).send({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.getBlockedUsers = async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.user.user_id });
        res.status(200).send({ blockedUsers: user.blockedUsers });
    } catch (error) {
        console.error("Error getting blocked users:", error);
        res.status(500).send({ message: 'Server error' });
    }
};
exports.followUser = async (req, res) => {
    try {
        const { user_id_to_follow } = req.body;
        const user = await User.findOne({ user_id: req.user.user_id });

        if (user.following.includes(user_id_to_follow)) {
            return res.status(400).send({ message: 'Already following this user' });
        }

        user.following.push(user_id_to_follow);
        const followedUser = await User.findOne({ user_id: user_id_to_follow });
        followedUser.followers.push(req.user.user_id);

        await user.save();
        await followedUser.save();

        res.status(200).send({ message: 'User followed successfully' });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { user_id_to_unfollow } = req.body;
        const user = await User.findOne({ user_id: req.user.user_id });

        user.following = user.following.filter(followingUser => followingUser !== user_id_to_unfollow);
        const unfollowedUser = await User.findOne({ user_id: user_id_to_unfollow });
        unfollowedUser.followers = unfollowedUser.followers.filter(follower => follower !== req.user.user_id);

        await user.save();
        await unfollowedUser.save();

        res.status(200).send({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.getFollowersAndFollowing = async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.user.user_id });
        res.status(200).send({ followers: user.followers, following: user.following });
    } catch (error) {
        console.error("Error getting followers/following:", error);
        res.status(500).send({ message: 'Server error' });
    }
};
