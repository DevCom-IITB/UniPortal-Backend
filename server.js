const express = require('express')
const dotenv = require('dotenv').config() //config() returns an object with a parsed key containing the loaded content or an error key if it failed. A parsed key is an object with key/value pairs where the values are strings or arrays. https://www.npmjs.com/package/dotenv
const connectDB = require('./config/db')
const port = process.env.PORT || 5000 // this line is used to set the port number to 5000 if the PORT environment variable is not set. https://www.npmjs.com/package/dotenv

const bodyParser = require('body-parser');



connectDB()
const app = express()
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false })) //what is urlencoded?: https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0s-router-options



//All routing goes here
app.use( '/question', require('./api/routes/questionRouters'))




//listening to port 5000 by default
app.listen(port, () => console.log(`Server running on port ${port}`))