const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        
        const { phoneNumber, name, gender, dob, user_id, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { user_id }] });
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
            password: hashedPassword,
        });

        console.log("User before saving:", user); // Log the user object before saving
        
        await user.save();

        console.log("User saved:", user); // Log the user after saving
        
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in signup:", error); // Catch and log any errors
        res.status(500).send({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET);
        console.log(token)
        user.tokens=user.tokens.concat({token})
        await user.save()
        res.status(200).send({ token, user_id:user.user_id, name: user.name });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.user_id);
    res.status(200).send({ user_id: user._id, name: user.name });
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