const router = require("express").Router();
let Booking = require("../models/booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Stripe integration

// ========================================
// ✅ POST /add – Booking + Stripe Checkout
// ========================================
router.route("/add").post(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    contact,
    gender,
    country,
    arrivalDate,
    departureDate,
    specialRequest
  } = req.body;

  const newBooking = new Booking({
    firstname,
    lastname,
    email,
    contact,
    gender,
    country,
    arrivalDate: new Date(arrivalDate),
    departureDate: new Date(departureDate),
    specialRequest
  });

  try {
    const savedBooking = await newBooking.save();

    // ✅ Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // or 'lkr'
            product_data: {
              name: "Community Experience Booking",
            },
            unit_amount: 2000, // $20.00 (in cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment-success?bookingId=${savedBooking._id}`,
      cancel_url: `http://localhost:3000/payment-cancel`,
      metadata: {
        bookingId: savedBooking._id.toString()
      }
    });

    // ✅ Send both _id and Stripe session URL to frontend
    res.status(201).json({
      message: "Booking added and Stripe session created",
      _id: savedBooking._id,
      sessionUrl: session.url
    });

  } catch (err) {
    console.error("Booking or payment error:", err);
    res.status(500).json({ error: "Error saving booking or creating payment session" });
  }
});

// =========================
// GET all bookings
// =========================
router.route("/get").get(async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send({
      status: "error with get bookings",
      error: err.message
    });
  }
});

// =========================
// GET one booking by ID
// =========================
router.route("/get/:id").get(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send({ status: "not found" });
    }
    res.status(200).send({ status: "tourist booking fetched", Booking: booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: "error with get booking", error: err.message });
  }
});

// =========================
// UPDATE booking by ID
// =========================
router.route("/update/:id").put(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    contact,
    gender,
    country,
    arrivalDate,
    departureDate,
    specialRequest
  } = req.body;

  const updateBooking = {
    firstname,
    lastname,
    email,
    contact,
    gender,
    country,
    arrivalDate,
    departureDate,
    specialRequest
  };

  try {
    await Booking.findByIdAndUpdate(req.params.id, updateBooking);
    res.status(200).send({ status: "booking updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error with updating data" });
  }
});

// =========================
// DELETE booking by ID
// =========================
router.route("/delete/:id").delete(async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "booking deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: "error with delete booking", error: err.message });
  }
});

module.exports = router;
