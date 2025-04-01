const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  businessId: { // ✅ keep this name
    type: Schema.Types.ObjectId,
    ref: "Business", // ✅ Must match your model name
    required: true
  },
  touristId: { // ✅ keep this name
    type: Schema.Types.ObjectId,
    ref: "User", // ✅ Or "Tourist" if that’s your actual model name
    required: true
  },
  status: {
    type: String,
    enum: ["paid", "failed", "pending refund", "refunded"],
    default: "paid"
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
