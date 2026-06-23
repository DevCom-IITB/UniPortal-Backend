const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
  // normalize token payload so downstream code sees consistent fields
  req.user_ID = decoded.user_ID;
  req.role = decoded.role;
  // ensure roles is an array when possible for verifyRoles checks
  req.roles = decoded.roles || (decoded.role ? [decoded.role] : []);
    next();
  });
};

module.exports = authenticateToken;
