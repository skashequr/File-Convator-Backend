const express = require("express");
const router = express.Router();
const AccessCard = require("../modals/accessCardModals");

router.post("/", async (req, res, next) => {
  try {
    const newAccessCard = new AccessCard(req.body);
    await newAccessCard.save(); // Remove the callback function
    res.status(201).json({
      message: "Access card was saved successfully",
      accessCard: newAccessCard, // Return the saved todo in the response
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
    const accessCard = await AccessCard.find();

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Access cards were retrieved successfully",
      accessCards: accessCard,
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
  try {
    // Use the find method to retrieve all todos
    const result = await AccessCard.deleteOne({ _id: req.params.id });

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Access Card was deleted successfully",
      allTodo: result,
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
    const result = await AccessCard.deleteMany({});

    // Send a response indicating success
    res.status(200).json({
      message: "Access Card was deleted successfully",
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
