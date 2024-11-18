const jwt = require('jsonwebtoken');
const userSchema = require("../models/studentSchema");
const { createAccountValidation, loginValidation } = require("../middlewares/ValidateStudent");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../util/sendEmail");
const { AUTH_EMAIL } = process.env;
require('dotenv').config();

// Generate matric number function
const generateMatricNumber = async () => {
    try {
        const lastStudent = await userSchema.findOne().sort({ Matric: -1 }); // Get the student with the highest matric number
        let lastMatricNumber = lastStudent ? lastStudent.Matric : 2106171000; // Start from 2106171000 if no students exist
        return lastMatricNumber + 1;
    } catch (error) {
        console.error("Error generating matric number:", error);
        throw new Error("Unable to generate matric number");
    }
};

// Account Creation
const createAccount = async (req, res) => {
    try {
        const { error } = createAccountValidation(req.body);
        if (error) {
            return res.render('sign-up', { message: error.details[0].message, success: false, alert: true });
        }

        const { First_Name, Last_Name, Email } = req.body;

        const checkEmail = await userSchema.findOne({ Email });
        if (checkEmail) {
            return res.render('sign-up', { message: "Email already exists", success: false, alert: true });
        }

        // Generate matric number
        const Matric = await generateMatricNumber();
        const Password = Last_Name.toLowerCase() + 'pass'; // Create password based on last name

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const profileImage = req.file ? '/uploads/' + req.file.filename : ''; // Get the relative image path

        // Create new user
        const newUser = await userSchema.create({
            First_Name,
            Last_Name,
            Matric,
            Email,
            Password, // Password will be hashed by the schema hook
            verificationCode,
            isVerified: false,
            Profile_Image: profileImage, // Save the relative image path
            lastLogin: Date.now() // Initialize lastLogin to current time
        });

        const message = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Hello <strong>${First_Name}</strong>,</p>
                
                <p>Thank you for registering with Ed-John Institute of Management And Technology. Your account has been created successfully. Below are your login details:</p>
                
                <p>Matric Number: <strong>${Matric}</strong></p>
                <p>Password: <strong>${Password}</strong></p>
                
                <p>To complete your registration, please verify your email by using the unique code provided below:</p>
                
                <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${verificationCode}</p>
                
                <p>Best regards,<br>
                Ed-John Institute Of Management And Technology</p>
                
                <p style="font-size: 12px; color: #888;">
                    <i>Disclaimer: This website is built for testing/projects purposes and does not represent the official institution.</i>
                </p>
            </div>
        `;

        const mailOptions = {
            from: 'lasustech.project@hotmail.com',
            to: Email,
            subject: "Ed-John Account Details & Email Verification",
            html: message
        };

        await sendEmail(mailOptions);

        return res.render('verify-email', { message: "Account created successfully. Please verify your email.", success: true, email: Email, alert: true });

    } catch (err) {
        console.error("Error occurred in createAccount:", err);
        return res.render('sign-up', { message: "Error occurred", success: false, error: err.message, alert: true });
    }
};

// User Login with OTP
const loginAccount = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.render('login', { message: error.details[0].message, success: false, alert: true });
        }

        const { Matric, Password } = req.body;
        console.log("Matric:", Matric); // Log the matric number
        console.log("Password:", Password); // Log the plain password

        const studentExist = await userSchema.findOne({ Matric });
        if (studentExist) {
            console.log("Stored Password:", studentExist.Password); // Log the stored hashed password
            
            // Compare the provided password with the stored hashed password
            const comparePassword = await bcrypt.compare(Password, studentExist.Password);
            console.log("Password Match:", comparePassword); // Log the comparison result

            if (comparePassword) {
                if (studentExist.isVerified) {
                    // Generate and send 2FA code
                    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
                    const twoFAExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity

                    studentExist.twoFACode = twoFACode;
                    studentExist.twoFAExpires = twoFAExpires;
                    await studentExist.save();

                    const message = `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                            <p>Hello <strong>${studentExist.First_Name}</strong>,</p>
                            <p>You are attempting to log in. Please use the 2FA code below to complete the login process:</p>
                            <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${twoFACode}</p>
                            <p>Best regards,<br>Ed-John Institute Of Management And Technology</p>
                            <p style="font-size: 12px; color: #888;">
                                <i>Disclaimer: This website is built for testing/projects purposes and does not represent the official institution.</i>
                            </p>
                        </div>
                    `;

                    const mailOptions = {
                        from: 'lasustech.project@hotmail.com',
                        to: studentExist.Email,
                        subject: "Ed-John Portal Login Authentication",
                        html: message
                    };

                    await sendEmail(mailOptions);

                    return res.render('verify-otp', { message: "A 2FA code has been sent to your email. Please enter it to complete the login.", success: true, Email: studentExist.Email, alert: true });

                } else {
                    return res.render('login', { message: "Please verify your email first.", success: false, alert: true });
                }
            } else {
                return res.render('login', { message: "Password mismatch", success: false, alert: true });
            }
        } else {
            return res.render('login', { message: "Matric number not found", success: false, alert: true });
        }
    } catch (err) {
        console.error("Error occurred in loginAccount:", err);
        return res.render('login', { message: "Error occurred", success: false, error: err.message, alert: true });
    }
};

module.exports = { createAccount, loginAccount };
