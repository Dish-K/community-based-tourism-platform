const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/paymentController");
const authenticateUser = require("../middleware/authenticateUser"); // We'll write this soon

router.post("/create-session", authenticateUser, createCheckoutSession);

// router.post("/create-session", authenticateUser, (req, res, next) => {
//     console.log("📥 /create-session route hit");
//     next();
//   }, createCheckoutSession);
  
module.exports = router;
