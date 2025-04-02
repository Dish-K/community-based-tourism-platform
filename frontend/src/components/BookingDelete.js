import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookingDelete.css';

function BookingDelete() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [searchBy, setSearchBy] = useState('id');

  const handleSearch = async () => {
    try {
      setError(null);
      setBookingDetails(null);
      const endpoint = searchBy === 'id'
        ? `http://localhost:5000/booking/get/${bookingId}`
        : `http://localhost:5000/booking/getByEmail/${email}`; // ❗ optional: you need this route if using email

      const response = await axios.get(endpoint);
      const booking = response.data.Booking;

      if (!booking) throw new Error("Booking not found");
      setBookingDetails(booking);
    } catch (err) {
      setError("Booking not found or could not be retrieved.");
      console.error("Error fetching booking:", err);
    }
  };

  const handleDelete = async () => {
    if (!bookingDetails || bookingDetails.paymentStatus === 'paid') return;

    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/booking/delete/${bookingDetails._id}`);
        alert('Booking successfully deleted!');
        navigate('/create');
      } catch (error) {
        setError('Failed to delete booking. Please try again.');
        setLoading(false);
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleCancel = () => {
    navigate('/create');
  };

  return (
    <div className="booking-delete-container">
      <h2>Delete Booking</h2>

      <div className="search-options">
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="searchBy"
              value="id"
              checked={searchBy === 'id'}
              onChange={() => setSearchBy('id')}
            />
            Search by ID
          </label>
          <label>
            <input
              type="radio"
              name="searchBy"
              value="email"
              checked={searchBy === 'email'}
              onChange={() => setSearchBy('email')}
            />
            Search by Email
          </label>
        </div>
      </div>

      <div className="search-bar">
        {searchBy === 'id' ? (
          <input
            type="text"
            placeholder="Enter Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
        ) : (
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookingDetails && (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{`${bookingDetails.firstname} ${bookingDetails.lastname}`}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{bookingDetails.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Contact:</span>
              <span className="value">{bookingDetails.contact}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gender:</span>
              <span className="value">{bookingDetails.gender}</span>
            </div>
            <div className="detail-item">
              <span className="label">Country:</span>
              <span className="value">{bookingDetails.country}</span>
            </div>
            <div className="detail-item">
              <span className="label">Arrival:</span>
              <span className="value">{new Date(bookingDetails.arrivalDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Departure:</span>
              <span className="value">{new Date(bookingDetails.departureDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item special-request">
              <span className="label">Special Request:</span>
              <span className="value">{bookingDetails.specialRequest || 'None'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Payment Status:</span>
              <span
                className="value"
                style={{
                  color:
                    bookingDetails.paymentStatus === 'paid'
                      ? 'green'
                      : bookingDetails.paymentStatus === 'refunded'
                      ? 'gray'
                      : bookingDetails.paymentStatus === 'pending refund'
                      ? 'orange'
                      : 'red'
                }}
              >
                {bookingDetails.paymentStatus || 'unpaid'}
              </span>
            </div>
          </div>

          <div className="button-group">
            <button
              onClick={handleDelete}
              className="delete-confirm-btn"
              disabled={loading || bookingDetails.paymentStatus === 'paid'}
              title={
                bookingDetails.paymentStatus === 'paid'
                  ? 'You cannot delete a paid booking'
                  : ''
              }
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDelete;
