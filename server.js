const express = require("express");
const dotenv = require("dotenv").config(); //config() returns an object with a parsed key containing the loaded content or an error key if it failed. A parsed key is an object with key/value pairs where the values are strings or arrays. https://www.npmjs.com/package/dotenv
const connectDB = require("./config/db");
const port = process.env.PORT || 5000; // this line is used to set the port number to 5000 if the PORT environment variable is not set. https://www.npmjs.com/package/dotenv
const path = require("path");
const bodyParser = require("body-parser");
const authenticateToken = require("./api/middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
const cors = require("cors");
connectDB();
const app = express();
// const prefix = "/api"; //comment out during dev
const prefix = ""; //comment out for deployment

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Set-Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

//middlewares
app.use(bodyParser.json()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //what is urlencoded?: https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0s-router-options
app.use(cookieParser()); 

//All routing goes here
app.use(prefix + "/user", require("./api/routes/userRouters"));

// app.use(authenticateToken);
app.use(
  prefix + "/question",
  require("./api/routes/questionRouters"),
  express.static("uploads")
);
app.use(prefix + "/info", require("./api/routes/infopostroutes"),express.static("uploads"));
app.use(prefix + "/search", require("./api/routes/elasticRouters"));

//listening to port 5000 by default
app.listen(port, () => console.log(`Server running on port ${port}`));
