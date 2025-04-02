import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingCreate.css';

function BookingCreate() {
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
    specialRequest: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    firstname: '',
    lastname: '',
    country: ''
  });

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

        setLoading(false);
      } catch (err) {
        setError('Error fetching booking details');
        setLoading(false);
        console.error('Error fetching booking:', err);
      }
    };

    if (id) {
      fetchBooking();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["firstname", "lastname", "country"].includes(name)) {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");

      if (value !== filteredValue) {
        setValidationErrors({
          ...validationErrors,
          [name]: 'Cannot enter symbols or numbers.'
        });
      } else {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        });
      }

      setFormData({
        ...formData,
        [name]: filteredValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ 1. Save booking first
      const saveRes = await axios.post('http://localhost:5000/booking/add', formData);
      const savedBookingId = saveRes.data._id;

      if (!savedBookingId) {
        alert("Booking created, but no ID returned.");
        return;
      }

      // ✅ 2. Start Stripe payment session
      const paymentRes = await axios.post('http://localhost:5000/api/payment/create-session', {
        bookingId: savedBookingId,
        amount: 5000, // or calculate dynamically
        businessId: "67ebbfd1272dd9cb54e4830e", // Replace with actual later
        touristId: "67ebbe05272dd9cb54e4830c"   // Replace with actual later
      });

      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      } else {
        alert("Booking saved but Stripe session not created.");
      }

      // Reset form (optional)
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        gender: '',
        country: '',
        arrivalDate: '',
        departureDate: '',
        specialRequest: ''
      });

    } catch (error) {
      console.error('❌ Error creating booking or initiating payment:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      contact: '',
      gender: '',
      country: '',
      arrivalDate: '',
      departureDate: '',
      specialRequest: ''
    });
  };

  const handleReadBookings = () => {
    navigate(`/read/67e918a845d690c19507e3a9`);
  };

  return (
    <div className="booking-create-container">
      <h2>Create New Booking</h2>
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
          />
          {validationErrors.firstname &&
            <div className="validation-error">{validationErrors.firstname}</div>}
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
          />
          {validationErrors.lastname &&
            <div className="validation-error">{validationErrors.lastname}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
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
          />
          {validationErrors.country &&
            <div className="validation-error">{validationErrors.country}</div>}
        </div>

        <div className="form-group">
          <label>Arrival Date:</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label>Special Request:</label>
          <textarea
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn submit-btn">Submit</button>
          <button type="reset" className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
          <button type="button" className="btn read-btn" onClick={handleReadBookings}>View Bookings</button>
        </div>
      </form>
    </div>
  );
}

export default BookingCreate;
