const mongoose = require("mongoose");

const usersReviewsSchema = new mongoose.Schema({
  email: {
    type: String,
    format: "email",
    required: true,
  },
  imageUrl: {
    type: String,
    format: "uri",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const usersReviews = mongoose.model("users-Review", usersReviewsSchema);

module.exports = usersReviews;
