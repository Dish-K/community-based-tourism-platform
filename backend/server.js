const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Register Mongoose models globally
require('./models/User');
require('./models/Business');
require('./models/Payment');
require('./models/Commission'); // optional, future-proof

// ✅ Stripe Webhook route (must use raw body)
const stripeWebhook = require("./webhook/stripeWebhook");
app.post(
  "/api/webhook/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ JSON parsing for all other routes
app.use(express.json());

// ✅ Enable CORS
app.use(cors());

// ✅ Mock authentication middleware
const { verifyToken } = require('./middleware/authenticateUser');
app.use(verifyToken); // Injects req.user based on x-mock-role header

// ✅ Routes
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('CBT Platform API is running 🎉');
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
