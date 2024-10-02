const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const User = require('../models/user');
exports.signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        
        const { phoneNumber, name, gender, dob, user_id, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({  user_id  });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            phoneNumber,
            name,
            gender,
            dob,
            user_id,
            email,
            password:hashedPassword
        });

        console.log("User before saving:", user); // Log the user object before saving
        
        await user.save();

        // console.log("User saved:", user); // Log the user after saving
        
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in signup:", error); // Catch and log any errors
        res.status(500).send({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    console.log("hell")
    const user = await User.findOne({ phoneNumber });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '30m' });
        console.log(token)
        user.tokens=user.tokens.concat({token})
        await user.save()
        res.status(200).send({ token, user_id:user.user_id, name: user.name });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
};


// exports.getProfile = async (req, res) => {
//     const user = await User.findById(req.user.user_id);
//     res.status(200).send({ user_id: user._id, name: user.name });
// };
exports.getProfile = async (req, res) => {
    const user = await User.findOne({ user_id: req.user.user_id });
    res.status(200).send({ user_id: user.user_id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, gender: user.gender, dob: user.dob });
};

exports.editProfile = async (req, res) => {
    try {
        const { name, gender, dob, email, phoneNumber } = req.body;
        const user = await User.findOne({ user_id: req.user.user_id });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (dob) user.dob = dob;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // If password is provided, update it after hashing
        // if (password) {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     user.password = hashedPassword;
        // }

        await user.save();

        res.status(200).send({ message: 'Profile updated successfully', user_id: user.user_id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, gender: user.gender, dob: user.dob });
    } catch (error) {
        console.error("Error in editProfile:", error);
        res.status(500).send({ message: 'Server error' });
    }
};
const User = require('../models/user'); // Adjust the path to your User schema

exports.deleteProfile = async (req, res) => {
    console.log("deleteProfile function called");

    try {
        const user_id = req.user.user_id;
        const { primary_reason, improvement_feedback } = req.body;

        console.log("Received data:", req.body);

        // Check if primary_reason and improvement_feedback are provided
        if (!primary_reason || !improvement_feedback) {
            return res.status(400).send({ error: "Primary reason and improvement feedback are required." });
        }

        console.log("Attempting to delete user:", user_id);

        // Deleting the user from the User schema
        const deletedUser = await User.findOneAndDelete({ user_id });

        if (!deletedUser) {
            return res.status(404).send({ error: "User not found or already deleted." });
        }

        // If successful
        res.status(200).send({ message: "Account deleted successfully." });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).send({ error: "Failed to delete account." });
    }
};


/*
http://localhost:3001/api/auth/signup
{
    "phoneNumber": "1234567890",
    "name": "John Doe",
    "gender": "Male",
    "dob": "1995-05-01",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
}
{
    "phoneNumber": "1234567890",
    "password": "securePassword123"
}
http://localhost:3001/api/problems
[
    {
        "_id": "problem_object_id_here",
        "user_id": "user_object_id_here",
        "description": "There's an issue with the service.",
        "createdAt": "2024-09-07T10:00:00.000Z"
    }
    // Other problems...
]
*/