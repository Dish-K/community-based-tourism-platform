// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from '../components/HomePage';
// import BookingPage from '../components/BookingPage';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentCancelled from '../components/PaymentCancelled';
import AdminPayments from "../components/AdminPaymentsPage";

import BookingCreate from "../components/BookingCreate";
import BookingRead from "../components/BookingRead";
import BookingUpdate from "../components/BookingUpdate";
import BookingDelete from "../components/BookingDelete";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/booking" element={<BookingPage />} /> */}
        {/* ✅ Removed old /payment route */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/admin/payments" element={<AdminPayments />} />

        <Route path="/booking/create" element={<BookingCreate />} />
        <Route path="/booking/read" element={<BookingRead />} />
        <Route path="/booking/update/:id" element={<BookingUpdate />} />
        <Route path="/booking/delete/:id" element={<BookingDelete />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
