const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { verifyToken, isAdmin } = require('../middleware/authenticateUser');

// ✅ GET all payments (with optional filters)
router.get('/payments', verifyToken, isAdmin, async (req, res) => {
  try {
    const filters = {};

    // ✅ Filter by month (YYYY-MM)
    if (req.query.date) {
      const start = new Date(`${req.query.date}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filters.createdAt = { $gte: start, $lt: end };
    }

    // ❌ Removed businessName filter (not in Payment schema directly)

    // ✅ Filter by booking ID 
    if (req.query.bookingId) {
      filters.bookingId = req.query.bookingId;
    }

    // ✅ Filter by status 
    if (req.query.status) {
      filters.status = req.query.status;
    }
    

    const payments = await Payment.find(filters)
      .populate('touristId', 'name email')      // works if User model exists
      .populate('businessId', 'name owner');     // works if Business model exists

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// ✅ PUT update a payment (Admin Edit)
router.put('/payments/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { bookingId, amount, touristId, businessId, status } = req.body;

    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { bookingId, amount, touristId, businessId, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update payment' });
  }
});

// ✅ DELETE a payment (Admin Delete)
router.delete('/payments/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
