const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');

// Add a movie to watchlist
router.post('/add-watchlist/:movieId', auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user.watchlist.includes(movie.id)) {
            user.watchlist.push(movie.id);
            await user.save();
        }
        res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a movie from watchlist
router.delete('/remove-watchlist/:movieId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.watchlist = user.watchlist.filter(movieId => movieId.toString() !== req.params.movieId);
        await user.save();
        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's watchlist
router.get('/watchlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json(user.watchlist);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
