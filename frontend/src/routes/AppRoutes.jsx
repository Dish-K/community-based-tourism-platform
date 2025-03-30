// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from '../components/HomePage';
import BookingPage from '../components/BookingPage';
import PaymentPage from '../components/PaymentPage';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentCancelled from '../components/PaymentCancelled';


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
