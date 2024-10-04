require('dotenv').config();
const mongoose = require('mongoose')

if (!process.env.MONGODB_URL || !process.env.JWT_SECRET_CODE || !process.env.API_KEY) {
    console.error('Please set all environment variables');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL),
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error.message);
        process.exit(1) // exit the code in one go
    }
}

mongoose.set('debug', true);

module.exports = connectDB;