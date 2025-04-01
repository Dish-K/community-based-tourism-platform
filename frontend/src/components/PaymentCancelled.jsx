import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentCancelled() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/booking");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled or failed.</p>
      <p>You can go back and try again anytime.</p>

      {/* 🔁 & 🏠 Buttons Container */}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        {/* Try Again Button */}
        <button
          onClick={handleRetry}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔁 Try Again
        </button>

        {/* Back to Home Button */}
        <button
          onClick={handleBackHome}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#7f8c8d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentCancelled;
