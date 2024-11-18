// Email Verification
const userSchema = require("../models/studentSchema");
const verifyEmail = async (req, res) => {
    try {
        const { verificationCode, Email } = req.body;

        const user = await userSchema.findOne({ Email });
        if (!user) {
            return res.render('verify-email', { message: "User not found", success: false, alert: true });
        }

        if (user.verificationCode !== verificationCode) {
            return res.render('verify-email', { message: "Invalid verification code", success: false, alert: true });
        }

        user.isVerified = true;
        user.verificationCode = undefined; // clear the verification code
        await user.save();

        return res.render('Login', { message: "Email verified successfully! You can now log in.", success: true, alert: true });

    } catch (err) {
        console.error("Error occurred in verifyEmail:", err);
        return res.render('verify-email', { message: "Error occurred", success: false, error: err.message, alert: true });
    }
};

module.exports = {verifyEmail};
