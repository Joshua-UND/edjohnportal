const express = require('express');
const router = express.Router();
const userSchema = require('../models/studentSchema'); // Ensure this path is correct
const authenticateToken = require('../middlewares/authsToken'); // Ensure this path is correct

// Route to render the dashboard
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch the user's data from the database
        const user = await userSchema.findById(req.user.id); // `req.user.id` should be set by your authentication middleware

        // Check if the user is found
        if (!user) {
            return res.redirect('/login');
        }

        // Get the current time based on the last login timestamp
        const lastLogin = new Date(user.lastLogin);
        const hours = lastLogin.getHours();
        let timeOfDay;

        if (hours < 12) {
            timeOfDay = 'morning';
        } else if (hours < 18) {
            timeOfDay = 'afternoon';
        } else {
            timeOfDay = 'evening';
        }

        // Render the dashboard template and pass the user data and time of day
        res.render('dashboard', {
            First_Name: user.First_Name,
            Last_Name: user.Last_Name,
            Matric: user.Matric,
            Profile_Image: user.Profile_Image,
            timeOfDay: timeOfDay,
            successMessage: req.query.successMessage || null, // Pass success message
            errorMessage: req.query.errorMessage || null    // Pass error message
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
