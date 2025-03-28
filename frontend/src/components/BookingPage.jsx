import React from 'react';
import { Link } from 'react-router-dom';

function BookingPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧳 Dummy Booking</h2>
      <p><strong>Experience:</strong> Village Hike in Ella</p>
      <p><strong>Date:</strong> 2025-04-10</p>
      <p><strong>Price:</strong> LKR 5000</p>

      <Link to="/payment">
        <button style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#2e86de",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          💳 Pay Now
        </button>
      </Link>
    </div>
  );
}

export default BookingPage;