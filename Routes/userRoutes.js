const express = require("express");
const { loginController, registerController } = require("../controlers/userControler");


const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register",registerController);
Router.get("/fetchUsers",);

module.exports = Router;