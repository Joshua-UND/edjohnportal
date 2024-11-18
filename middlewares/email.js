const { hashdata, verifyHashedData } = require("../util/hashdata");
const OTP = require("../otp/model");
const { AUTH_EMAIL } = process.env; // Ensure AUTH_EMAIL is defined

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Example OTP generator

const verifyOTP = async ({ Email, otp }) => {
    try {
        if (!(Email && otp)) {
            throw new Error("Provide values for email and OTP.");
        }

        // Ensure OTP exists
        const matchedOTPRecord = await OTP.findOne({ Email });
        if (!matchedOTPRecord) {
            throw new Error("Invalid OTP or OTP record not found.");
        }

        const { expireAt } = matchedOTPRecord;

        // Check for expiration
        if (expireAt < Date.now()) {
            await OTP.deleteOne({ Email });
            throw new Error("OTP has expired.");
        }

        // Verify OTP
        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

// const sendOTP = async ({ Email, subject, message, duration = 1 }) => {
//     try {
//         if (!(Email && subject && message)) {
//             throw new Error("Please provide values for Email, Subject, and Message.");
//         }

//         // Clear existing old records
//         await OTP.deleteOne({ Email });

//         // Generate OTP
//         const generatedOTP = generateOTP();

//         // Prepare mail options
//         const mailOptions = {
//             from: AUTH_EMAIL,
//             to: Email,
//             subject,
//             html: `<p>${message}</p><p style="color:tomato; font-size:25px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
//                    <p>This code <b>expires in ${duration} hour(s)</b></p>`,
//         };

//         // Send email
//         await sendEmail(mailOptions);

//         // Hash OTP and save
//         const hashedOTP = await hashdata(generatedOTP);
//         const newOTP = new OTP({
//             Email,
//             otp: hashedOTP,
//             createdAt: Date.now(),
//             expireAt: Date.now() + 3600000 * duration, // Duration in milliseconds
//         });

//         const createdOTPRecord = await newOTP.save();
//         return createdOTPRecord;
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         throw error;
//     }
// };

const sendOTP = async ({ Email, subject, message, duration = 1 }) => {
    try {
        if (!(Email && subject && message)) {
            throw new Error("Please provide values for Email, Subject, and Message.");
        }

        // Clear existing old records
        await OTP.deleteOne({ Email });

        // Generate OTP
        const generatedOTP = generateOTP();
        console.log(`Generated OTP: ${generatedOTP}`); // Log the OTP

        // Prepare mail options
        const mailOptions = {
            from: AUTH_EMAIL,
            to: Email,
            subject,
            html: `<p>${message}</p><p style="color:tomato; font-size:25px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
                   <p>This code <b>expires in ${duration} hour(s)</b></p>`,
        };

        // Send email
        await sendEmail(mailOptions);

        // Hash OTP and save
        const hashedOTP = await hashdata(generatedOTP);
        const newOTP = new OTP({
            Email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 3600000 * duration,
        });

        const createdOTPRecord = await newOTP.save();
        console.log(`OTP saved successfully: ${createdOTP}`); // Log successful save
        return createdOTPRecord;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};



const deleteOTP = async (Email) => {
    try {
        await OTP.deleteOne({ Email });
    } catch (error) {
        console.error('Error deleting OTP:', error);
        throw error;
    }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };
