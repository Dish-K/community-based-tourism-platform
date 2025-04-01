// backend/webhook/stripeWebhook.js

const stripe = require("../config/stripe");
const generateInvoice = require("../utils/invoiceGenerator");
const sendEmail = require("../utils/emailSender");
const path = require("path");
const Payment = require("../models/Payment");
const Commission = require("../models/Commission");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    const businessId = session.metadata.businessId;
    const touristId = session.metadata.touristId;
    const email = session.customer_details.email;
    const amount = session.amount_total / 100; // from cents to LKR/USD

    const commissionRate = 0.1;
    const commissionAmount = amount * commissionRate;

    try {
      // Save payment record
      await Payment.create({
        bookingId,
        amount,
        businessId,
        touristId,
        status: "paid"
      });

      // Save commission record
      await Commission.create({
        bookingId,
        businessId,
        amount,
        commissionRate,
        commissionAmount
      });

      // Generate invoice
      const filename = `invoice-${bookingId}.pdf`;
      const filePath = path.join(__dirname, "../invoices", filename);
      await generateInvoice({ bookingId, amount, businessId, touristId }, filename);

      // Send email with invoice
      await sendEmail({
        to: email,
        subject: `CBT Invoice – Booking ${bookingId}`,
        text: `Hi, your invoice for booking ${bookingId} is attached.`,
        attachmentPath: filePath
      });

      console.log("✅ Webhook handled: payment, commission, invoice, email");
    } catch (err) {
      console.error("❌ Webhook processing error:", err);
    }
  }

  res.json({ received: true });
};
