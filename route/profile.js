const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// Create a new profile
router.post('/profiles', auth, async (req, res) => {
    const { profileName, avatar, preferences } = req.body;

    try {
        const user = await User.findById(req.user.id);

        const newProfile = {
            profileName,
            avatar: avatar || 'default_avatar.png',
            preferences: preferences || { genres: [] }
        };

        user.profiles.push(newProfile);
        await user.save();

        res.status(201).json(user.profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update an existing profile
router.put('/profiles/:profileId', auth, async (req, res) => {
    const { profileName, avatar, preferences } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const profile = user.profiles.id(req.params.profileId);

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        profile.profileName = profileName || profile.profileName;
        profile.avatar = avatar || profile.avatar;
        profile.preferences = preferences || profile.preferences;

        await user.save();
        res.status(200).json(user.profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a profile
router.delete('/profiles/:profileId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.profiles = user.profiles.filter(profile => profile.id !== req.params.profileId);

        await user.save();
        res.status(200).json(user.profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all profiles for the authenticated user
router.get('/profiles', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profiles');
        res.status(200).json(user.profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
