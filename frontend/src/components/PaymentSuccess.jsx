import React from 'react';
import { useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>✅ Payment Successful!</h1>
      <p>Your booking was confirmed.</p>
      <p><strong>Booking ID:</strong> {bookingId}</p>
      <p>We’ve emailed you the invoice. Thank you for using our platform!</p>
    </div>
  );
}

export default PaymentSuccess;
