const mongoose = require("mongoose");

const feedbackModals = mongoose.Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean },
    user_id: {type: String },
    name: {type: String },
    email : {type: String},
    review: {type: String},
    rating: {type: Number},
    image_url: {type: String}
  },
  
  {
    timeStamp: true,
  }
);

const Feedback = mongoose.model("Feedbacks", feedbackModals);
module.exports = Feedback;