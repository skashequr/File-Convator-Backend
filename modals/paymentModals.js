const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  plan: {
    type: String,
    required: true,
  },
  price_per_month: {
    type: String,
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
  tran_id: {
    type: String,
    required: true,
  },
  paidStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("payment-user-info", paymentSchema);
