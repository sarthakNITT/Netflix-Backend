const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sarthakkarode:Ujwalsanmitra123@netflixbackend.dvqv7.mongodb.net/?', {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }),
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error.message);
        process.exit(1) // exit the code in one go
    }
}

module.exports = connectDB;