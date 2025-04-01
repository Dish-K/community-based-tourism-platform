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
    const amount = session.amount_total / 100;

    const commissionRate = 0.1;
    const commissionAmount = amount * commissionRate;

    const filename = `invoice-${bookingId}.pdf`;
    const filePath = path.join(__dirname, "../invoices", filename);

    try {
      // ✅ Try creating payment record
      let paymentDoc;
      try {
        paymentDoc = await Payment.create({
          bookingId,
          amount,
          businessId,
          touristId,
          status: "paid"
        });
      } catch (err) {
        if (err.code === 11000) {
          console.warn("⚠️ Duplicate bookingId, using existing payment instead.");
          paymentDoc = await Payment.findOne({ bookingId });
        } else {
          throw err;
        }
      }

      // ✅ Create or upsert commission (optional: skip if already exists)
      await Commission.create({
        bookingId,
        businessId,
        amount,
        commissionRate,
        commissionAmount
      }).catch(err => {
        if (err.code === 11000) {
          console.warn("⚠️ Duplicate commission skipped.");
        } else {
          throw err;
        }
      });

      // ✅ Generate invoice if not already there
      await generateInvoice({ bookingId, amount, businessId, touristId }, filename);

      // ✅ Send email with invoice
      await sendEmail({
        to: email,
        subject: `CBT Invoice – Booking ${bookingId}`,
        text: `Hi, your invoice for booking ${bookingId} is attached.`,
        attachmentPath: filePath
      });

      console.log("✅ Webhook completed: Payment, Invoice, Email sent.");
    } catch (err) {
      console.error("❌ Webhook processing error:", err);
    }
  }

  res.json({ received: true });
};
