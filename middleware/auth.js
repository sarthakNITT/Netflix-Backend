require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_CODE;

if (!process.env.MONGODB_URL || !process.env.JWT_SECRET_CODE || !process.env.API_KEY) {
    console.error('Please set all environment variables');
    process.exit(1);
}


module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    
    console.log('Token received: ', token);

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token: ', decoded);  // Log decoded token
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('JWT Error: ', err);  // Log error details
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
