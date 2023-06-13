const asyncHandler = require("express-async-handler"); //async-handler for handling errors in async functions
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require('axios');

//whenever we set or remove cookie use secure : true during deployment
//DONT PUSH DONT PUSH DONT PUSH IN DEPLOYMENT
//*********************************************************** */
//this function is only for experiments and not for deployment
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, user_ID, password, role } = req.body;

    if (!name || !user_ID || !password || !role) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    // check if the user exists
    const userExists = await userModel.findOne({ user_ID });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      user_ID: user_ID,
      password: hashedPassword,
      role: role,
    });
    await newUser
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    throw new Error("Fields entered are not valid");
  }
});
//***************************************************************/

//student login but should be extended to SMP login in future
const loginUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies; //loading cookie from any previous login(current device) if it exists
  console.log("COOKIE from previous session %s", cookies);
  //get details from req
  const { user_ID, password } = req.body;
  //find the student from the database
  const foundUser = await userModel.findOne({ user_ID });
  //check with the credentials
  if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
    const role = foundUser.role;
    const userINFO = { user_ID: foundUser.user_ID, role: role };
    const accessToken = jwt.sign(userINFO, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600s",
    }); //generating new accessToken
    //To accesss inner contents of accessToken in front end we will need jwt decode ...
    const newRefreshToken = jwt.sign(
      userINFO,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    ); //generating new refreshToken

    //if we find existing cookie on this device we move it
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    //say a previous cookie existed we clear that cookie and add the newly generated refresh token
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await userModel.findOne({ refreshToken }).exec();

      // if refresh token is not found in the database we clear all cookies as the one we get from the cookie from the browser is not valid
      if (!foundToken) {
        foundUser.refreshToken = [];
        await foundUser.save().catch((err) => console.log(err));
        throw new Error("Detected tampering with cookies");
      }
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    }
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser
      .save()
      .catch((err) => console.log("Couldnt save refresh token"));
    //We send the new refresh token as a cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.json({ accessToken: accessToken, role : foundUser.role }); // and we send the access token as a request
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

//Add code for SMP login here
//Get auth code from SSO 
//send request to gymkhana servers to get access token and refresh token
//make another request to gymkhana to get user resources
//send resources as response to the client
const SMPLogin = asyncHandler(async (req, res) => {
  const authCode = req.body.authCode;
  console.log(authCode);

  //send request to gymkhana servers to get access token and refresh token

  const body = `code=${authCode}&grant_type=authorization_code&redirect_uri=https://localhost:8000/`

  console.log('body is ', body);

  const config = {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization' : 'Basic cEdFdG42bVI1d1pMMGdPYkhXMVZtSVdJOXd4cWpCSlZmRUFyUjlpeTp5QzB3RzY5QzBLWWduSjA3ajZ2WFJxSFBhOGYxZ1NKMkFKNVBlbFB2N3p3NjhCeGpleDc3dHY1UTlwQ1ZteUpEWmtYTWc2YXdidzBsdThzSGZLVEFxeDB1c2JVd1JMSXd6NllsN1Rzd3kzdFZxaXhqdWpwMFA3SGlhd1VPTGxHRw==' //this need to be added to the env file
    },
    url : 'https://gymkhana.iitb.ac.in/profiles/oauth/token/',
    data : body
  }
  
  const res1 = await axios(config)
  const data = res1.data;
  const accessToken = data.access_token;
  const bearer = `Bearer ${accessToken}`;

  console.log('bearer is ', bearer);

  const config2 = {
    method : 'GET',
    url : 'https://gymkhana.iitb.ac.in/profiles/user/api/user/?fields=roll_number',
    headers : {
      'Authorization' : bearer
    }
  }

  const res2 = await axios(config2)
  const rollNumber = parseInt(res2.data.roll_number);
  console.log('roll number is ', rollNumber);
  return res.status(200).json({rollNumber : rollNumber})
  



});

//for creating new access tokens once the old ones have expired
//as well as implementing refresh token rotation
const refreshUser = asyncHandler(async (req, res) => {
  //get details from req
  const cookies = req.cookies;
  console.log("cookie is: %s", cookies);
  //say we logged out previously, this would prevent from creating new access tokens
  if (!cookies?.jwt)
    return res.status(401).json({ message: "No Refresh Token Found" });
  const refreshToken = cookies.jwt; //if jwt in cookie exists we extract the refresh token from it
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //after extarcting the refresh token we remove it

  //we find the user who has that particular refresh token
  const foundUser = await userModel.findOne({ refreshToken });

  //In case we dont find a user that would imply reuse/tampering detection
  //check if such a user exists
  if (!foundUser) {
    // jwt.verify checks if the refresh token is valid and if it is valid it returns the decoded token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "cookie not found" }); //Forbidden
        const hackedUser = await userModel
          .findOne({ user_ID: decoded.user_ID })
          .exec();
        hackedUser.refreshToken = [];
        console.log("hacked user refresh token cleared"); //essentially if we find reuse of refreshTokens , we will be removing all refreshTokens ever granted to that profile, and making them login to all the devices
        await hackedUser.save();
      }
    );
    return res.status(401).json({ message: "user not found" });
  }

  //proceeds only if user was found else user needs to log back again to all of its devices
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  ); //basically we keep all the refresh tokens of other devices except our own one

  //verifying the validity of the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        //if token expired
        console.log("Please Login again");
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }
      if (err || foundUser.user_ID + "" !== decoded.user_ID + "") {
        //if manipulation done
        console.log("Please Login again");
        return res.sendStatus(403);
      }

      //Generating new tokens
      const role = foundUser.role;
      const userINFO = { user_ID: foundUser.user_ID, role: role };
      const accessToken = jwt.sign(userINFO, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600s",
      }); //generating new access token
      //refresh token rotation
      const newRefreshToken = jwt.sign(
        userINFO,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      ); //generating new refresh token
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]; //we append everything to the refreshToken array in database
      await foundUser
        .save()
        .catch((err) => console.log("Couldnt save refresh token"));
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      });
      console.log("Successful regeneration of tokens");
      res.json({ accessToken: accessToken, role : foundUser.role, user_ID : foundUser.user_ID });
      //sending the new access token
    }
  );
});

//logging out
//refreshing user
const logoutUser = asyncHandler(async (req, res) => {
  //get details from req
  const cookies = req.cookies;
  if (!cookies?.jwt){
    console.log("cookie not found");
    return res.sendStatus(403);
  }
  const refreshToken = cookies.jwt;

  //find the student from the database
  const foundUser = await userModel.findOne({ refreshToken });
  //check with the credentials
  if (!foundUser){
    console.log("user not found");
    return res.sendStatus(403);
  }
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  ); //basically we keep all the refresh tokens of other devices except our own one
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true }); ///add secure:true during deployment
  console.log("works");
  res.json({ message: "Cookie removed" });
});



module.exports = { registerUser, loginUser, SMPLogin, refreshUser, logoutUser };
