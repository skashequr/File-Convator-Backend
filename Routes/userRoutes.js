const express = require("express");
const { loginController, registerController , fetchAllUsersController, singleUser, userById, pagginateUser, deleateUser, infinityScrolling, findAdmine } = require("../controlers/userControler");
const { protect } = require("../middleware/authMiddleware");


const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register",registerController);
Router.get("/fetchUsers" ,fetchAllUsersController);
Router.get("/",singleUser)
Router.get("/userbyId" , userById);
Router.get("/pagginate" , pagginateUser);
Router.get("/infinityScrolling" , infinityScrolling);
Router.delete("/delateUser/:id" , deleateUser);
Router.get("/findAdmine" , findAdmine);

module.exports = Router;