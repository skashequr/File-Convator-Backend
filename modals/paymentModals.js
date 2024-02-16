const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  cus_name: {
    type: String,
    required: true,
  },
  cus_email: {
    type: String,
    required: true,
  },
  cus_address: {
    type: String,
    required: true,
  },
  cus_phone: {
    type: Number, // Changed to Number
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  access_limit: {
    type: String,
    required: true,
  },
  plan_id: {
    type: String,
    required: true,
  },
  pay_time: {
    type: String,
    required: true,
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
