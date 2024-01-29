const express = require("express");
const { loginController, registerController , fetchAllUsersController } = require("../controlers/userControler");
const { protect } = require("../middleware/authMiddleware");


const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register",registerController);
Router.get("/fetchUsers",fetchAllUsersController);

module.exports = Router;