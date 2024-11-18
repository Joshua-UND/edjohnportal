// routes/logout.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Logout route accessed');
    res.clearCookie('authToken'); 
    
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.redirect('/login'); 
});

module.exports = router;
