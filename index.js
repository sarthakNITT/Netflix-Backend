require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./MongoDB/db')
const bcrypt = require('bcryptjs');
const Port = 3001

// Import the routes from user.js
const userRoutes = require('./route/user');

// Import the routes from movie.js
const movieRoutes = require('./route/movie');

const watchlistRoutes = require('./route/watchlist');
const continueWatchingRoutes = require('./route/continueWatching');
const profileRoutes = require('./route/profile');

//Middleware to parse the json files
app.use(express.json()) 

app.get('/', (req,res)=>{
    res.send('Server is running')
})

// Use the routes from user.js
app.use('/api/auth', userRoutes); // All routes will be prefixed with /api/auth
app.use('/api', movieRoutes); // All routes will be prefixed with /api
app.use('/api', watchlistRoutes);
app.use('/api', continueWatchingRoutes);
app.use('/api', profileRoutes);

connectDB();

app.listen(Port, ()=>{
    console.log(`Server is running on Port ${Port}`);
})

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
