const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createAccount, loginAccount } = require('../controllers/auth');
const { verifyEmail } = require('../controllers/verify-email.js');
const { verifyOTP } = require('../controllers/verify-otp');

// Route for user registration
router.post('/sign-up', upload.single('profileImage'), createAccount);

// Route for user login
router.post('/login', loginAccount);

// Route for email verification
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);

// Route for OTP verification
router.post('/verify-otp', verifyOTP);

module.exports = router;
