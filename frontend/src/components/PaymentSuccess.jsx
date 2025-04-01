import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.post("http://localhost:5000/api/payment/resend-invoice", { bookingId }, {
        headers: {
          Authorization: `Bearer YOUR_TEST_JWT_HERE`,
          'Content-Type': 'application/json'
        }
      });
      setStatus("✅ " + res.data.message);
    } catch (err) {
      setStatus("❌ Failed to resend invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>✅ Payment Successful!</h1>
      <p>Your booking was confirmed.</p>
      <p><strong>Booking ID:</strong> {bookingId}</p>
      <p>We’ve emailed you the invoice. Thank you for using our platform!</p>

      {/* Download Button */}
      <a
        href={`http://localhost:5000/api/payment/invoice/invoice-${bookingId}.pdf`}
        download
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#2e86de",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none"
        }}
      >
        📥 Download Invoice PDF
      </a>

      {/* Resend Email Button */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleResend}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#27ae60",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          {loading ? "⏳ Sending..." : "📧 Resend Invoice Email"}
        </button>
      </div>

      {/* Status Message */}
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}

export default PaymentSuccess;
