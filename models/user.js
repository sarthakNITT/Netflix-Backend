const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    profileName:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'netflix-profile-pictures-red.webp'
    },
    preferences: {
        geners: [String]
    },
    watchlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    continueWatching: [
        {
            movie: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie'
            },
            resumePosition: {
                type: Number,
                default: 0
            }
        }
    ]
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profiles: [profileSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('profile', profileSchema);