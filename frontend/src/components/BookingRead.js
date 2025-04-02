import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './BookingRead.css';

function BookingRead() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid booking ID');
      setLoading(false);
      return;
    }
    fetchBookingData();
  }, [id]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/booking/get/${id}`);
      setBooking(response.data.Booking);
      setLoading(false);
    } catch (err) {
      setError('Error fetching booking information');
      setLoading(false);
      console.error('Error fetching booking information:', err);
    }
  };

  const navigateToUpdate = () => {
    navigate(`/update/${id}`);
  };

  const navigateToDelete = async () => {
    const confirmation = window.confirm('Are you sure you want to delete this booking?');
    if (confirmation) {
      try {
        await axios.delete(`http://localhost:5000/booking/delete/${id}`);
        alert('Booking deleted successfully');
        navigate('/create');
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking');
      }
    }
  };

  const navigateToList = () => {
    navigate('/create');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const generatePDF = () => {
    const confirmation = window.confirm('Download this booking as a pdf...');
    if (confirmation && booking) {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Booking Information', 20, 20);

      doc.setFontSize(12);
      doc.text(`Full Name: ${booking.firstname} ${booking.lastname}`, 20, 30);
      doc.text(`Email: ${booking.email}`, 20, 40);
      doc.text(`Contact: ${booking.contact}`, 20, 50);
      doc.text(`Gender: ${booking.gender}`, 20, 60);
      doc.text(`Country: ${booking.country}`, 20, 70);
      doc.text(`Arrival Date: ${formatDate(booking.arrivalDate)}`, 20, 80);
      doc.text(`Departure Date: ${formatDate(booking.departureDate)}`, 20, 90);
      doc.text(`Special Request: ${booking.specialRequest || 'None'}`, 20, 100);
      doc.text(`Payment Status: ${booking.paymentStatus || 'unpaid'}`, 20, 110);

      doc.save(`Booking_${booking._id}.pdf`);
    } else {
      alert('Download canceled');
    }
  };

  if (loading) return <div className="booking-loading">Loading booking information...</div>;
  if (error) return <div className="booking-error">{error}</div>;
  if (!booking) return <div className="booking-error">Booking not found</div>;

  const isPaid = booking.paymentStatus === 'paid';

  return (
    <div className="booking-read-container">
      <h2>Booking Information</h2>

      <div className="booking-info-card">
        <div className="booking-info-header">
          <h3>{`${booking.firstname} ${booking.lastname}`}</h3>
          <div className="booking-reference">Reference: {booking._id}</div>
        </div>

        <div className="booking-info-grid">
          <div className="info-field">
            <span className="field-label">Email:</span>
            <span className="field-value">{booking.email}</span>
          </div>
          <div className="info-field">
            <span className="field-label">Contact:</span>
            <span className="field-value">{booking.contact}</span>
          </div>
          <div className="info-field">
            <span className="field-label">Gender:</span>
            <span className="field-value">{booking.gender}</span>
          </div>
          <div className="info-field">
            <span className="field-label">Country:</span>
            <span className="field-value">{booking.country}</span>
          </div>
          <div className="info-field">
            <span className="field-label">Arrival Date:</span>
            <span className="field-value">{formatDate(booking.arrivalDate)}</span>
          </div>
          <div className="info-field">
            <span className="field-label">Departure Date:</span>
            <span className="field-value">{formatDate(booking.departureDate)}</span>
          </div>
          <div className="info-field full-width">
            <span className="field-label">Special Request:</span>
            <span className="field-value">{booking.specialRequest || 'None'}</span>
          </div>

          {/* ✅ Payment status display */}
          <div className="info-field full-width">
            <span className="field-label">Payment Status:</span>
            <span
              className="field-value"
              style={{
                color:
                  booking.paymentStatus === 'paid'
                    ? 'green'
                    : booking.paymentStatus === 'refunded'
                    ? 'gray'
                    : booking.paymentStatus === 'pending refund'
                    ? 'orange'
                    : 'red'
              }}
            >
              {booking.paymentStatus || 'unpaid'}
            </span>
          </div>
        </div>

        <div className="booking-controls">
          <button
            onClick={navigateToUpdate}
            className="edit-button"
            disabled={isPaid}
            title={isPaid ? 'Paid bookings cannot be updated' : ''}
          >
            Edit
          </button>

          <button
            onClick={navigateToDelete}
            className="remove-button"
            disabled={isPaid}
            title={isPaid ? 'Paid bookings cannot be deleted' : ''}
          >
            Remove
          </button>

          <button onClick={navigateToList} className="list-button">Back to Bookings</button>
          <button onClick={generatePDF} className="download-pdf-button">Download Booking Details</button>
        </div>
      </div>
    </div>
  );
}

export default BookingRead;
