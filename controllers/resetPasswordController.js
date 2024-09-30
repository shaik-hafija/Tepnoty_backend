const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let generatedOtp;
let otpExpiry;  // To store the OTP expiry time

// Send OTP to the user's email
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        generatedOtp = Math.floor(100000 + Math.random() * 900000);
        otpExpiry = Date.now() + 10 * 60 * 1000;  // OTP expires in 10 minutes

        // Set up Nodemailer to send the OTP to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,  // App password if using 2FA
            },
            tls: {
                rejectUnauthorized: false  // Disable strict certificate checking
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${generatedOtp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        res.status(500).send({ message: 'Server error' });
    }
};

// Verify the OTP entered by the user
exports.verifyOtp = (req, res) => {
    const { otp, email } = req.body;

    if (!generatedOtp || !otpExpiry || Date.now() > otpExpiry) {
        return res.status(400).send({ message: 'OTP has expired' });
    }

    if (otp == generatedOtp) {
        // Generate a JWT token with the email embedded in it, valid for 10 minutes

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // Invalidate the OTP after use
        generatedOtp = null;
        otpExpiry = null;

        return res.status(200).send({ message: 'OTP verified', token });
    } else {
        return res.status(400).send({ message: 'Invalid OTP' });
    }
};

// Reset the password after OTP verification
exports.resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    try {
        // Verify the token to extract the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        console.log(email)


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Hash the new password and save it to the user's account
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).send({ message: 'Password reset successful' });
    } catch (error) {
        console.error("Error in resetting password:", error);
        res.status(500).send({ message: 'Server error' });
    }
};
// {
//     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mjc2OTI0MzMsImV4cCI6MTcyNzY5MzAzM30._3dB_OqY0HlTx48E63fZQ4QdhJ5NwOljBWn--K5Yqvg",
//      "newPassword":"yas", "confirmPassword":"yas"
// }
// Reset the password after OTP verification
// exports.resetPassword = async (req, res) => {
//     // Extract token from the Authorization header
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).send({ message: 'Authorization token missing or invalid' });
//     }

//     const token = authHeader.split(' ')[1]; // Get the token part (after 'Bearer ')

//     const { newPassword, confirmPassword } = req.body;

//     if (newPassword !== confirmPassword) {
//         return res.status(400).send({ message: 'Passwords do not match' });
//     }

//     try {
//         // Verify the token to extract the email
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const email = decoded.email;

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         // Hash the new password and save it to the user's account
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;

//         await user.save();

//         res.status(200).send({ message: 'Password reset successful' });
//     } catch (error) {
//         console.error("Error in resetting password:", error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };
