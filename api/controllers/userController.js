const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");

const freshieModel = require("../models/user1Model");

const loginUser = asyncHandler(async (req, res) => {
  //get details from req
  const { rollnumber, password } = req.body;
  //check all details are filled or not
  if (!rollnumber || !password) {
    res.status(400);
    throw new Error("PLease fill all the details");
  }
  //find the student from the database
  const freshie = await freshieModel.findOne({ rollnumber });
  //check with the credentials
  if (freshie && (await bcrypt.compare(password, freshie.password))) {
    res.json({ message: "Login Successful" });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

module.exports = { loginUser };
