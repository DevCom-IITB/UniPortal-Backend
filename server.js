const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const userModel = require("./api/models/userModel");
const ROLES_LIST = require("./config/roles_list");

dotenv.config();
const port = process.env.PORT || 5000; // this line is used to set the port number to 5000 if the PORT environment variable is not set.
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const rawNodeEnv = process.env.NODE_ENV || "";
const nodeEnv = rawNodeEnv.replace(/^['"]|['"]$/g, "");
const isDev = nodeEnv === "development" || nodeEnv === "DEV";
const prefix = isDev ? "" : "/newbee/api";

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
app.use(prefix+ "/notification", require("./api/routes/notificationRouters"));
app.use(prefix+ "/taggedQ", require("./api/routes/tagRouters"));


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

app.use(prefix + "/search", require("./api/routes/searchRouters"));
app.use(prefix + "/translate", require("./api/routes/translateRouters"));

// global error handler that returns JSON for any unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

//WebSocket Server
require('./webSocket/websocketServer')

const ensureDefaultSMPUser = async () => {
  try {
    const crypto = require("crypto");
    const sha256Password = crypto.createHash("sha256").update("smp").digest("hex");
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(sha256Password, salt);

    const existingSmpUser = await userModel.findOne({ user_ID: "smp" });
    if (existingSmpUser) {
      existingSmpUser.password = hashedPassword;
      await existingSmpUser.save();
      console.log("Updated default SMP user with correct SHA-256 hash password.");
      return;
    }

    await userModel.create({
      name: "SMP User",
      user_ID: "smp",
      password: hashedPassword,
      role: ROLES_LIST.SMP,
    });
    console.log("Created default SMP user: user_ID=smp, password=smp (SHA-256 hashed)");
  } catch (error) {
    console.error("Error creating default SMP user:", error);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureDefaultSMPUser();
  app.listen(port, () =>
    console.log(
      `Server running on port ${port}, On ${prefix}, In env ${process.env.NODE_ENV}. NLP Service URL: ${process.env.NLP_SERVICE_URL || "http://127.0.0.1:5001"}`
    )
  );
};

startServer();