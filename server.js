const express = require("express");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000; // this line is used to set the port number to 5000 if the PORT environment variable is not set. https://www.npmjs.com/package/dotenv
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
connectDB();
const app = express();
const prefix = process.env.NODE_ENV == "DEV" ? "" : "/newbee/api";

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

//middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //what is urlencoded?: https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0s-router-options
app.use(cookieParser());

app.use(prefix + "/uploads", express.static("./uploads"));
//All routing goes here
app.use(prefix + "/user", require("./api/routes/userRouters"));

// app.use(authenticateToken);
app.use(
  prefix + "/question",
  require("./api/routes/questionRouters"),
  express.static("uploads")
);
app.use(
  prefix + "/info",
  require("./api/routes/infopostroutes"),
  express.static("uploads")
);

//for future versions
//app.use(prefix + "/search", require("./api/routes/elasticRouters"));

//listening to port 5000 by default
app.listen(port, () =>
  console.log(
    `Server running on port ${port}, On ${prefix}, In env ${process.env.NODE_ENV}`
  )
);
