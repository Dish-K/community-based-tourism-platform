const stripe = require("../config/stripe");

exports.createCheckoutSession = async (req, res) => {

  console.log("🔥 Received request body:", req.body); //

  const { bookingId, amount, businessId } = req.body;
  const user = req.user; // Comes from JWT (we’ll wire up auth next)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd", // or "lkr"
          product_data: {
            name: "CBT Experience Booking",
          },
          unit_amount: amount * 100, // Stripe uses cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      metadata: {
        bookingId,
        businessId,
        touristId: user.id,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
