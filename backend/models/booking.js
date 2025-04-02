const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/]
  },
  lastname: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/]
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  country: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  specialRequest: {
    type: String
  },

  // ✅ Added by [YourName]: for payment tracking
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed', 'refund_requested', 'refunded'],
    default: 'unpaid'
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
