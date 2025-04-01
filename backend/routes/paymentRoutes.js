const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authenticateUser");
const { createCheckoutSession } = require("../controllers/paymentController");
const sendEmail = require("../utils/emailSender");

// ✅ Stripe session route
router.post("/create-session", verifyToken, createCheckoutSession);

// ✅ Download route for existing invoices
router.get("/invoice/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../invoices", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("❌ Failed to send invoice:", err);
      res.status(404).send("Invoice not found");
    }
  });
});

// ✅ Resend email with existing invoice
router.post("/resend-invoice", verifyToken, async (req, res) => {
  const { bookingId } = req.body;
  const email = req.user?.email || req.body.email;
  const touristId = req.user?.id || req.body.touristId;

  if (!bookingId || !email || !touristId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const filename = `invoice-${bookingId}.pdf`;
  const filePath = path.join(__dirname, "../invoices", filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await sendEmail({
      to: email,
      subject: `CBT Invoice – Booking ${bookingId}`,
      text: `Hi again, here’s your invoice for booking ${bookingId}.`,
      attachmentPath: filePath,
    });

    res.json({ message: "Invoice resent successfully!" });
  } catch (err) {
    console.error("❌ Resend failed:", err);
    res.status(500).json({ error: "Failed to resend invoice." });
  }
});

module.exports = router;
