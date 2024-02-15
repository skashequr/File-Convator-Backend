const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Payment = require("../modals/paymentModals");
const SSLCommerzPayment = require("sslcommerz-lts");
const { ObjectId } = require("mongodb");
const store_id = "black65cb4eba5f405";
const store_passwd = "black65cb4eba5f405@ssl";
const is_live = false; //true for live, false for sandbox

router.post("/", async (req, res) => {
  try {
    const tranId = new ObjectId().toString();

    const memberUserInformation = {
      plan_id: req.body.productId,
      access_limit: req.body.access_limit,
      price_per_month: req.body.price_per_month,
      plan: req.body.plan,
      tran_id: tranId,
      paidStatus: false,
    };

    // Save payment information to the database
    const PaymentUserInformation = new Payment(memberUserInformation);
    await PaymentUserInformation.save();

    const data = {
      total_amount: req.body.price_per_month,
      currency: "BDT",
      tran_id: tranId,
      success_url: `http://localhost:5000/payment/payment-success/${tranId}`,
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_id: req.body.plan_id,
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01313131311",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "9300",
      ship_country: "Bangladesh",
    };

    console.log(data);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.post("/payment-success/:tranId", async (req, res) => {
  console.log("req.params.tranId", req.params.tranId);
  try {
    const updatedPaidStatus = await Payment.findOneAndUpdate(
      { tran_id: req.params.tranId }, // Query for the Payment document with the specified tran_id
      { paidStatus: true }, // Update the paidStatus field to true
      { new: true } // Return the modified document
    );

    if (!updatedPaidStatus) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.redirect(`http://localhost:5173/aboutUs`);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Use the find method to retrieve all todos
    const payment = await Payment.find();

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "All Payment were retrieved successfully",
      allPayment: payment,
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
    const result = await Payment.deleteOne({ _id: req.params.id });

    // Send a response with the retrieved todos
    res.status(200).json({
      message: "Payment was deleted successfully",
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

module.exports = router;
