const express = require("express");
const { feedback, sendFeedback } = require("../controlers/feedbackControllers");

const router = express.Router();

router.route("/").get(feedback);
router.route("/sendFeedback").post(sendFeedback);
module.exports = router;