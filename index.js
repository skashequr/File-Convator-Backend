const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000 ;
const mongoose = require('mongoose');
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
// middleware
app.use(cors());
app.use(express.json());




const connectDb = async () => {
    try {
      const connect = await mongoose.connect("mongodb+srv://File-Convator:hSr5S9HgjKJqXX4z@cluster0.ruyf0su.mongodb.net/?retryWrites=true&w=majority");
      console.log("Server is Connected to Database");
    } catch (err) {
      console.log("Server is NOT connected to Database", err.message);
    }
  };
  connectDb();
console.log(process.env.MONGO_URI);


app.use("/user", userRoutes);
app.use("/chat", chatRoutes);




app.get('/', (req, res) => {
    res.send('EndGame Group Project File Convarting running')
})

app.listen(port, () => {
    console.log(`EndGame Group Project File Convarting running in ${port}`);
})