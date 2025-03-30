import React from 'react';

function PaymentCancelled() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled or failed.</p>
      <p>You can go back and try again anytime.</p>
    </div>
  );
}

export default PaymentCancelled;
