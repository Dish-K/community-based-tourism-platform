const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../utils/emailSender');
const generateInvoice = require('../utils/invoiceGenerator');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe signs each webhook — we must validate it!
module.exports = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle successful checkouts
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const bookingId = session.metadata.bookingId;
    const businessId = session.metadata.businessId;
    const touristId = session.metadata.touristId;
    const amount = session.amount_total / 100; // convert from cents
    const email = session.customer_details.email;

    const filename = `invoice-${bookingId}.pdf`;
    const filePath = path.join(__dirname, '../invoices', filename);

    // Avoid duplicate sends
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ Invoice already exists for ${bookingId}. Skipping re-send.`);
      return res.status(200).send("Invoice already sent.");
    }

    (async () => {
      try {
        await generateInvoice({ bookingId, amount, businessId, touristId }, filename);
        await sendEmail({
          to: email,
          subject: `CBT Invoice – Booking ${bookingId}`,
          text: `Hi, your invoice for booking ${bookingId} is attached.`,
          attachmentPath: filePath
        });

        console.log(`✅ Invoice generated & emailed for booking ${bookingId}`);
        res.status(200).send("Invoice generated & email sent.");
      } catch (err) {
        console.error("❌ Failed during webhook invoice handling:", err);
        res.status(500).send("Webhook error");
      }
    })();
  } else {
    res.status(200).send("Event ignored");
  }
};
