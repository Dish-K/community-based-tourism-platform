"use client"

import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./payment-success.css"

function PaymentSuccess() {
  const [params] = useSearchParams()
  const bookingId = params.get("bookingId") || "TOUR-12345" // Fallback for preview

  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleResend = async () => {
    setLoading(true)
    setStatus("")
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/resend-invoice",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer YOUR_TEST_JWT_HERE`,
            "Content-Type": "application/json",
          },
        },
      )
      setStatus("✅ " + res.data.message)
    } catch (err) {
      setStatus("❌ Failed to resend invoice.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate("/") // Change to "/booking" if you want to go back to BookingPage instead
  }

  // For preview purposes - current date formatted nicely
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())

  return (
    <div className="payment-success-container payment-success-fade-in">
      <div className="payment-success-header">
        <div className="payment-success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="payment-success-title">Payment Successful</h1>
        <p className="payment-success-subtitle">Your booking has been confirmed</p>
      </div>

      <div className="payment-success-content">
        <p className="payment-success-text">
          Thank you for your payment. We've sent a confirmation email with your invoice.
        </p>

        <div className="payment-success-details">
          <div className="payment-success-detail-row">
            <span className="payment-success-detail-label">Booking ID</span>
            <p className="payment-success-detail-value">{bookingId}</p>
          </div>

          <div className="payment-success-detail-row">
            <span className="payment-success-detail-label">Date</span>
            <p className="payment-success-detail-value">{formattedDate}</p>
          </div>

          <div className="payment-success-detail-row">
            <span className="payment-success-detail-label">Status</span>
            <p className="payment-success-detail-value" style={{ color: "#10b981" }}>
              Confirmed
            </p>
          </div>
        </div>

        <div className="payment-success-actions">
          <a
            href={`http://localhost:5000/api/payment/invoice/invoice-${bookingId}.pdf`}
            download
            className="payment-success-button payment-success-download"
          >
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Invoice
          </a>

          <button onClick={handleResend} className="payment-success-button payment-success-resend" disabled={loading}>
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Resend Invoice Email
              </>
            )}
          </button>

          <button onClick={handleGoBack} className="payment-success-button payment-success-home">
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

        {status && <div className={`payment-success-status ${status.includes("❌") ? "error" : ""}`}>{status}</div>}
      </div>
    </div>
  )
}

export default PaymentSuccess

