const asyncHandler = require("express-async-handler");
const Feedback = require("../modals/feedbackModals");

const feedback = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching Feedbacks API...");

    const results = await Feedback.find(); // Assuming 'userId' is the field to populate

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const sendFeedback = asyncHandler(async (req, res) => {
    try {
      console.log("Fetching Feedbacks API...");
      const feedbackData = req.body
      const createdChat = await Feedback.create(feedbackData);
      console.log(feedbackData);
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching feedbacks:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = {
  feedback,
  sendFeedback
};
