const express = require('express')
const app = express()
const connectDB = require('./MongoDB/db')
const Port = 3001

//Middleware to parse the json files
app.use(express.json()) 

app.get('/', (req,res)=>{
    res.send('Server is running')
})

app.post('/data', (req,res)=>{
    const {name} = req.body
    res.send(`Hello, ${name}!`)
})

connectDB();

app.listen(Port, ()=>{
    console.log(`Server is running on Port ${Port}`);
})