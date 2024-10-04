const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: String, 
        required: true 
    },
    releaseDate: { 
        type: String, 
        required: true 
    },
    tmdbId: { 
        type: Number, 
        unique: true 
    },  // Store TMDB ID for reference
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Movie', movieSchema)