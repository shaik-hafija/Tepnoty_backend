const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit OTP
};

exports.sendOTP = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log(`OTP sent to ${phoneNumber}: ${message.sid}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};
