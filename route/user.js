require('dotenv').config();
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const express = require('express')
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET_CODE;
if (!process.env.MONGODB_URL || !process.env.JWT_SECRET_CODE || !process.env.API_KEY) {
    console.error('Please set all environment variables');
    process.exit(1);
}


// user signup
router.post('/signup', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

         // Hash the password before saving
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password
        });

        await user.save();
        
        // Create and sign JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User created',
            token: token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// User Login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create and sign JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Get All Users (protected route)
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get Profile of Authenticated User (protected route)
router.get('/profile', auth, async (req, res) => {
    console.log('Profile route hit'); // Add this for debugging

    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;