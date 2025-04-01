const stripe = require("../config/stripe");

exports.createCheckoutSession = async (req, res) => {
  console.log("🔥 Received request body:", req.body);

  // ✅ Take all data directly from the request body
  const { bookingId, amount, businessId, touristId } = req.body;

  // ✅ Validate everything is provided
  if (!bookingId || !amount || !businessId || !touristId) {
    return res.status(400).json({ error: "Missing required payment info." });
  }

  try {
    // ✅ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd", // or "lkr"
          product_data: {
            name: "CBT Experience Booking",
          },
          unit_amount: amount * 100, // Stripe requires cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,

      // ✅ Save full metadata for webhook to access later
      metadata: {
        bookingId,
        businessId,
        touristId
      },
    });

    // ✅ Respond with redirect URL
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
