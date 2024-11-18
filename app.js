const express = require('express');
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const AuthRoute = require("./Routes/authRoutes");
const dashboardRoutes = require('./Routes/dashboard');
const authenticateToken = require('./middlewares/authsToken');
const app = express();
const path = require('path');

// Connect to database
const mongourl = process.env.MONGODB_URI;
mongoose.connect(mongourl).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
});


// Set up Handlebars engine
app.engine("hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set("view engine", "hbs");

// Middleware setup
app.use(cookieParser()); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const logoutRoute = require('./Routes/logout');
app.use('/logout', logoutRoute);

// app.js
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Routes setup
app.use( AuthRoute);

// Use the dashboard routes
app.use('/dashboard', authenticateToken, dashboardRoutes);

// Render login and signup views
app.get('/login', (req, res) => {
    res.render('Login');
});

app.get('/', (req, res) => {
    res.render('Login');
});

app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
