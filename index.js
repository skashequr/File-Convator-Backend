const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { feedback } = require("./controlers/feedbackControllers");
const convertRoutes = require("./Routes/convertRoutes");
const paymentRoutes = require("./controlers/paymentController");
const accessRoutes = require("./controlers/accessCardController");
const searchRoutes = require("./controlers/searchDataController");
const usersReviewsRoutes = require("./controlers/usersReviewController");

// middleware
app.use(
  cors({
    origin: [
      "https://65cf7c887739e70095b163ee--spectacular-profiterole-6a28ae.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],

    credentials: true,
  })
);
app.use(express.json());

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://File-Convator:hSr5S9HgjKJqXX4z@cluster0.ruyf0su.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();
console.log(process.env.MONGO_URI);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use("/feedback", feedback);
app.use("/convert", convertRoutes);
app.use("/payment", paymentRoutes);
app.use("/access-card", accessRoutes);
app.use("/search", searchRoutes);
app.use("/users-review", usersReviewsRoutes);

// Endpoint for PDF to Word conversion

app.get("/", (req, res) => {
  res.send("EndGame Group Project File Convarting running");
});

app.listen(port, () => {
  console.log(`EndGame Group Project File Convarting running in ${port}`);
});
