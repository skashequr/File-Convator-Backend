const generateToken = require("../Config/generateToken");
const UserModel = require("../modals/userModel");
const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const User = require("../modals/singleUser");
// Login
const loginController = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, password } = req.body;

  const user = await UserModel.findOne({ name });

  console.log("fetched user Data", user);
  console.log("efhqwfgwjeh", await user.matchPassword(password));
  if (user && password == user.password) {
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
  const { name, email, password, isAdmin , imageUrl } = req.body;

  // check for all fields
  console.log(
    "password = ",
    password,
    " email = ",
    email,
    "name = ",
    name,
    "isAdmine =",
    isAdmin
  );
  if (!name || !email || !password) {
    res.send(400);
    throw Error("All necessary input fields have not been filled");
  }

  //--------------- pre-existing user------------------
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    // res.send(405);
    throw new Error("User already Exists");
  }

  // -------------userName already Taken-------------------
  const userNameExist = await UserModel.findOne({ name });
  if (userNameExist) {
    // res.send(406);
    throw new Error("UserName already taken");
  }

  // create an entry in the db
  const user = await UserModel.create({ name, email, password, isAdmin , imageUrl });
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

const singleUser = expressAsyncHandler(async (req, res) => {
  const userEmail = req.query.email;
  // console.log(userEmail);
  try {
    // Query the database for user data associated with the provided email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user data is found, you can send it as a response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error retrieving user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sending user by id . I use this user in chat

const userById = expressAsyncHandler(async (req, res) => {
  // console.log("pqrs");
  const id = req.query.id;
  try {
    // Query the database for user data associated with the provided _id
    const user = await User.findById(id);

    if (!user) {
      console.log("User not found");
    } else {
      res.send(user);
      // console.log('User found:', user);
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
});

//Paggination user page count
const userCount = expressAsyncHandler(async (req, res) => {
  const totalUser = await User.countDocuments();
  res.json(totalUser);
});

const pagginateUser = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // number of page
  const pageSize = parseInt(req.query.pageSize) || 3; // items per pages
  const q = req.query.q;
  const query = q ? { name: { $regex: new RegExp(q, "i") } } : {};
  try {
    const totalCount = await User.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.json({ data, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const infinityScrolling = expressAsyncHandler(async (req, res) => {
  const { page } = req.query;
  const perPage = 3;
  const pageNumber = parseInt(page) || 1;
  const limit = parseInt(perPage) || 2;
  const skip = (pageNumber - 1) * limit;
  console.log("page", "=", page, "perPage", "=", perPage);
  try {
    const items = await User.find().skip(skip).limit(limit);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleateUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log("dhdhdfh");

  try {
    const deletedData = await User.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const findAdmine = expressAsyncHandler(async (req, res) => {
  console.log("xxxxx");
  const isAdmin = true;
  try {
    // Query the database for user data associated with the provided email
    const user = await User.findOne({ isAdmin: isAdmin });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user data is found, you can send it as a response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error retrieving user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const paidUsers = expressAsyncHandler(async (req, res) => {

});
module.exports = {
  loginController,
  registerController,
  fetchAllUsersController,
  singleUser,
  userById,
  pagginateUser,
  userCount,
  deleateUser,
  infinityScrolling,
  findAdmine,
  paidUsers
};
