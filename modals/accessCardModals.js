const mongoose = require("mongoose");
const accessSchema = mongoose.Schema({
  plan: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  access_limit: {
    type: String,
    // required: true,
  },
  plan_id: {
    type: String,
    // required: true,
  },
});


/**{
  "plan": "Standard Plan",
  "price": 49,
  "access_limit": "1 month"
} */

module.exports = mongoose.model("access-card", accessSchema);
