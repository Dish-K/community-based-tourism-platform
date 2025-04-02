"use client"
import { useNavigate } from "react-router-dom"
import "./payment-cancelled.css"

function PaymentCancelled() {
  const navigate = useNavigate()

  const handleRetry = () => {
    navigate("/booking/create")
  }

  const handleBackHome = () => {
    navigate("/")
  }

  return (
    <div className="payment-cancelled-container payment-cancelled-fade-in">
      <div className="payment-cancelled-header">
        <div className="payment-cancelled-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="payment-cancelled-title">Payment Cancelled</h1>
        <p className="payment-cancelled-subtitle">Your transaction was not completed</p>
      </div>

      <div className="payment-cancelled-content">
        <p className="payment-cancelled-text">Your payment was cancelled or failed to process.</p>
        <p className="payment-cancelled-text">You can try again or return to the home page.</p>

        <div className="payment-cancelled-actions">
          <button onClick={handleRetry} className="payment-cancelled-button payment-cancelled-retry">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            Try Again
          </button>

          <button onClick={handleBackHome} className="payment-cancelled-button payment-cancelled-home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelled

