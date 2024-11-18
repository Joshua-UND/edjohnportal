const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
    console.log('Cookies:', req.cookies); // Check cookies object
    const token = req.cookies?.authToken;

    if (!token) {
        console.log('No token found');
        return res.redirect('/login');
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.redirect('/login');
        }
        req.user = user; // Add user info to request object
        next();
    });
};

module.exports = authenticateToken;
