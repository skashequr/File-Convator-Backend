const express = require("express");
const router = express.Router();
const UsersReviews = require("../modals/usersReviewsModals");

// console.log("usersReviewsModals");
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newUsersReviews = new UsersReviews(req.body);
    await newUsersReviews.save(); // Remove the callback function
    res.status(201).json({
      message: "Users reviews was saved successfully",
      usersReviews: newUsersReviews, // Return the saved todo in the response
    });
  } catch (error) {
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.post("/all", async (req, res, next) => {
  try {
    const allUsersReviews = await UsersReviews.insertMany(req.body); // Use await to wait for the insertMany operation to complete
    res.status(201).json({
      message: "Users reviews were saved successfully",
      usersReviews: allUsersReviews, // Return the saved todos in the response
    });
  } catch (error) {
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Use the find method to retrieve all todos
    const usersReviews = await UsersReviews.find();

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Users reviews were retrieved successfully",
      SearchDates: usersReviews,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.get("/user", async (req, res, next) => {
  try {
    // Use the find method to retrieve all todos
    const usersReviews = await UsersReviews.find({ email: req.query.email });

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Users reviews were retrieved successfully",
      userReviews: usersReviews,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  console.log("req.query.id", req.params.id);
  try {
    // Use the find method to retrieve all todos
    const result = await UsersReviews.deleteOne({ _id: req.params.id });

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Users reviews was deleted successfully",
      usersReviews: result,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.delete("/", async (req, res, next) => {
  console.log("all deleted successfully");
  try {
    // Use the deleteMany method to delete all documents in the collection
    const result = await UsersReviews.deleteMany({});

    // Send a response indicating success
    res.status(200).json({
      message: "Users reviews was deleted successfully",
      deletedCount: result.deletedCount, // Number of documents deleted
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

module.exports = router;
