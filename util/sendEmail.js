const nodemailer = require("nodemailer");
const { AUTH_EMAIL, AUTH_PASS } = process.env;

let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASS,
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// Test transporter
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Transporter Verification Error:", error);
    } else {
        console.log("SMTP Transporter is ready to send messages.");
    }
});

const sendEmail = async (mailOptions) => {
    try {
        console.log("Sending email with options:", mailOptions);
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };
