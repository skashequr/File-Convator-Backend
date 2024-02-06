const generateToken = require("../Config/generateToken");
const UserModel = require("../modals/userModel");
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const User = require('../modals/singleUser');
// Login
const loginController = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, password } = req.body;

  const user = await UserModel.findOne({ name });

  console.log("fetched user Data", user);
  console.log("efhqwfgwjeh" , await user.matchPassword(password));
  if (user && password==user.password) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
    console.log(response);
    res.json(response);
  } else {
    res.status(401);
    throw new Error("Invalid UserName or Password");
  }
});


// Registration
const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // check for all fields
  console.log("password = " , password , " email = " , email , "name = " , name);
  if (!name || !email || !password) {
    res.send(400);
    throw Error("All necessary input fields have not been filled");
  }

  // pre-existing user
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    // res.send(405);
    throw new Error("User already Exists");
  }

  // userName already Taken
  const userNameExist = await UserModel.findOne({ name });
  if (userNameExist) {
    // res.send(406);
    throw new Error("UserName already taken");
  }

  // create an entry in the db
  const user = await UserModel.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(keyword);

  // Check if req.user exists before accessing its properties
  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user ? req.user._id : null },
  });
  res.send(users);
});

const singleUser =expressAsyncHandler(async (req, res) => {

  const userEmail = req.query.email;
  try {
    // Query the database for user data associated with the provided email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user data is found, you can send it as a response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = {
  loginController,
  registerController,
  fetchAllUsersController,
  singleUser
};