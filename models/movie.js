const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true,
        unique: true
    },
    genre: {
        type: String,
        require: true,
        unique: true
    },
    releaseDate: {
        type: String,
        require: true,
        unique: true
    },
    createdAt: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = mongoose.model('Movie', movieSchema)