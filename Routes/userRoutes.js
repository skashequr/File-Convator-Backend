const express = require("express");
const { loginController, registerController , fetchAllUsersController, singleUser } = require("../controlers/userControler");
const { protect } = require("../middleware/authMiddleware");


const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register",registerController);
Router.get("/fetchUsers" ,fetchAllUsersController);
Router.get("/",singleUser)

module.exports = Router;