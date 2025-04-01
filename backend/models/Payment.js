// backend/models/Payment.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  businessId: {
    type: String,
    required: true
  },
  touristId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["paid", "failed", "pending refund", "refunded"],
    default: "paid"
  },
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model("Payment", paymentSchema);
