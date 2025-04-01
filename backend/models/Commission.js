// backend/models/Commission.js

const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  businessId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 0.1 // 10%
  },
  commissionAmount: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Commission", commissionSchema);
