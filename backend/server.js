const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Stripe Webhook route (raw body required)
const stripeWebhook = require("./webhook/stripeWebhook");
app.post(
  "/api/webhook/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ JSON parsing for everything else (after webhook)
app.use(bodyParser.json());

// Middlewares
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateUser = require('./middleware/authenticateUser');
app.use(authenticateUser); 

// Routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CBT Platform API is running 🎉');
});

// DB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
