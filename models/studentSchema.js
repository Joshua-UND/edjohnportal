const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,
    },
    Last_Name: {
        type: String,
        required: true,
    },
    Matric: {
        type: Number,
        required: true,
        unique: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Profile_Image: { 
        type: String,
        required: false,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    twoFACode: {
        type: String,
        required: false,
    },

    twoFAExpires:{
        type:Date ,
        
    },
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (!this.isModified('Password')) return next(); // Proceed if password is modified
    try {
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.Password, genSalt);
        this.Password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("StudentAccount", studentSchema);
