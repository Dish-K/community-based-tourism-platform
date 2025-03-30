import React from 'react';
import axios from 'axios';

function BookingPage() {
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-session',
        {
          bookingId: 'BOOK123',     // Replace with real booking ID
          amount: 5000,             // LKR amount
          businessId: 'BUS123'      // Replace with real business ID
        },
        {
          headers: {
            Authorization: `Bearer YOUR_TEST_JWT_HERE`, // Replace with real token
            'Content-Type': 'application/json'
          }
        }
      );

      const checkoutUrl = response.data.url;
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("❌ Stripe session failed:", error);
      alert("Something went wrong while initiating payment.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧳 Dummy Booking</h2>
      <p><strong>Experience:</strong> Village Hike in Ella</p>
      <p><strong>Date:</strong> 2025-04-10</p>
      <p><strong>Price:</strong> LKR 5000</p>

      <button
        onClick={handlePayment}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#2e86de",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        💳 Pay Now
      </button>
    </div>
  );
}

export default BookingPage;
