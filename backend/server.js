const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

//
const authenticateUser = require('./middleware/authenticateUser');
app.use(authenticateUser); 


//
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Base route (optional)
app.get('/', (req, res) => {
  res.send('CBT Platform API is running 🎉');
});

// DB Connection + Server Start
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    
    // app.use((req, res) => {
    //   console.log("🛑 Request not matched:", req.method, req.originalUrl);
    //   res.status(404).send("Route not found");
    // });
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

