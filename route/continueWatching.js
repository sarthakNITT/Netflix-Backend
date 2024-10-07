const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');

// Add a movie to continue watching or update resume position
router.post('/continue-watching/:movieId', auth, async (req, res) => {
    const { resumePosition } = req.body;  // Time in seconds or minutes
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const user = await User.findById(req.user.id);
        const existingEntry = user.continueWatching.find(item => item.movie.toString() === req.params.movieId);

        if (existingEntry) {
            existingEntry.resumePosition = resumePosition;  // Update the position
        } else {
            user.continueWatching.push({ movie: movie.id, resumePosition });
        }

        await user.save();
        res.status(200).json({ message: 'Resume position updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get continue watching list
router.get('/continue-watching', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('continueWatching.movie');
        res.status(200).json(user.continueWatching);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
