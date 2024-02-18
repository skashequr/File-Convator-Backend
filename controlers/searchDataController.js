const express = require("express");
const router = express.Router();
const SearchData = require("../modals/searchDataModals");

router.post("/", async (req, res, next) => {
  try {
    const newSearchData = new SearchData(req.body);
    await newSearchData.save(); // Remove the callback function
    res.status(201).json({
      message: "Search Data was saved successfully",
      SearchData: newSearchData, // Return the saved todo in the response
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
    const allSearchData = await SearchData.insertMany(req.body); // Use await to wait for the insertMany operation to complete
    res.status(201).json({
      message: "Search Dates were saved successfully",
      allTodo: allSearchData, // Return the saved todos in the response
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
    const searchData = await SearchData.find();

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Search Datas were retrieved successfully",
      SearchDates: searchData,
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
    const result = await SearchData.deleteOne({ _id: req.params.id });

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Search Data was deleted successfully",
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
    const result = await SearchData.deleteMany({});

    // Send a response indicating success
    res.status(200).json({
      message: "Search Data was deleted successfully",
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
