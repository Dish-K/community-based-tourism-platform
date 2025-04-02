import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingUpdate.css';

function BookingUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    gender: '',
    country: '',
    arrivalDate: '',
    departureDate: '',
    specialRequest: '',
    paymentStatus: '' // ✅ new
  });

  const [isPaid, setIsPaid] = useState(false); // ✅ new

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/booking/get/${id}`);
        const booking = response.data.Booking;

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          ...booking,
          arrivalDate: formatDate(booking.arrivalDate),
          departureDate: formatDate(booking.departureDate)
        });

        setIsPaid(booking.paymentStatus === 'paid'); // ✅ check paid status
        setLoading(false);
      } catch (err) {
        setError('Error fetching booking details');
        setLoading(false);
        console.error('Error fetching booking:', err);
      }
    };

    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPaid) {
      alert('You cannot update a paid booking.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/booking/update/${id}`, formData);
      alert('Booking successfully updated!');
      navigate(`/read/${id}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(`/read/${id}`);
  };

  if (loading) return <div className="loading">Loading booking details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-update-container">
      <h2>Update Booking</h2>

      {isPaid && (
        <div className="paid-warning" style={{ color: 'red', marginBottom: '1rem' }}>
          ⚠️ This booking has already been paid. You cannot update it.
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>Payment Status:</strong>{" "}
        <span style={{ color: isPaid ? 'green' : 'red' }}>
          {formData.paymentStatus || 'unpaid'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            pattern="[A-Za-z\s]+"
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            disabled={isPaid}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Arrival Date:</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
            disabled={isPaid}
          />
        </div>

        <div className="form-group">
          <label>Special Request:</label>
          <textarea
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            rows="4"
            disabled={isPaid}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn update-submit-btn" disabled={isPaid}>
            Update
          </button>
          <button type="button" className="btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingUpdate;
