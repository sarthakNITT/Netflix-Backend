require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./MongoDB/db')
const bcrypt = require('bcryptjs');
const Port = 3001

// Import the routes from user.js
const userRoutes = require('./route/user');

//Middleware to parse the json files
app.use(express.json()) 

app.get('/', (req,res)=>{
    res.send('Server is running')
})

// Use the routes from user.js
app.use('/api/auth', userRoutes); // All routes will be prefixed with /api/auth

connectDB();

app.listen(Port, ()=>{
    console.log(`Server is running on Port ${Port}`);
})

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
