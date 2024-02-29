const express = require("express");
const router = express.Router();
const Payment = require("../modals/paymentModals");
const SSLCommerzPayment = require("sslcommerz-lts");
const { ObjectId } = require("mongodb");
const store_id = "black65cb4eba5f405";
const store_passwd = "black65cb4eba5f405@ssl";
const is_live = false; //true for live, false for sandbox

// Set the time zone to Bangladesh Standard Time (BST), which is UTC+6
// const options = {
//   timeZone: 'Asia/Dhaka',
//   hour12: false, // Use 24-hour format
// };

// Get the current time zone offset in milliseconds

// Apply the offset to get Bangladesh time

// Display the Bangladesh time
// console.log(bdTime);

// Format the date object to display the time in Bangladesh
// const bdTime = currentDate.toLocaleTimeString('en-US', options);

// console.log('Current time in Bangladesh:', bdTime);
router.post("/", async (req, res) => {
  try {
    var today = new Date();

    var formatter = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Dhaka", // Bangladesh Standard Time
    });

    // Format the date and time using the formatter
    var dateTime = formatter.format(today);

    console.log("dateTime", dateTime);
    const tranId = new ObjectId().toString();

    const memberUserInformation = {
      cus_name: req.body.name,
      cus_email: req.body.email,
      cus_address: req.body.address,
      cus_phone: req.body.phone,
      plan: req.body.plan,
      price: req.body.price,
      access_limit: req.body.access_limit,
      plan_id: req.body.productId,
      access_limit_day: req.body.access_limit_day,
      pay_time: dateTime,
      tran_id: tranId,
      paidStatus: false,
    };
    console.log("memberUserInformation", memberUserInformation);

    // Save payment information to the database
    const PaymentUserInformation = new Payment(memberUserInformation);
    await PaymentUserInformation.save();

    const data = {
      total_amount: req.body.price,
      currency: "BDT",
      tran_id: tranId,
      success_url: `https://file-convator-backend.vercel.app/payment/payment-success/${tranId}`,
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_id: req.body.productId,
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: req.body.name,
      cus_email: req.body.email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: req.body.address,
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: req.body.phone,
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

    res.redirect(`http://localhost:5173/dashboad/userProfile`);
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
    const payment = await Payment.find({ paidStatus: true });

    // Send a response with the retrieved todos
    res.status(200).json(payment);
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.get("/all-count", async (req, res, next) => {
  try {
    // Use the find method to retrieve all payments
    const allPayments = await Payment.find();
    const count = allPayments.length; // Count the number of payments

    // Send a response with the count of payments
    res.status(200).json({ count });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.get("/all-pay-list", async (req, res, next) => {
  try {
    // Use the find method to retrieve all payments
    const allPayments = await Payment.find();

    // Send a response with the count of payments
    res.status(200).json(allPayments);
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "There was an error",
      message: error.message,
    });
  }
});

router.put("/", async (req, res, next) => {
  console.log("paidStatus: false ", req.body.id);
  try {
    const updatedPaidStatus = await Payment.findOneAndUpdate(
      { _id: req.body.id }, // Query for the Payment document with the specified tran_id
      { paidStatus: false }, // Update the paidStatus field to true
      { new: true } // Return the modified document
    );

    if (!updatedPaidStatus) {
      return res.status(404).json({
        message: "Paid Status is not updated",
      });
    }

    res.send(updatedPaidStatus);
  } catch (error) {
    console.error("Error updating payment:", error);
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
