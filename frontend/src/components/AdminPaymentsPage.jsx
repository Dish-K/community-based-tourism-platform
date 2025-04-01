import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    bookingId: "",
    date: "",
    status: ""
  });

  const [editingPayment, setEditingPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    bookingId: "",
    amount: "",
    status: ""
  });

  const fetchPayments = async (currentFilters = filters) => {
    try {
      const query = new URLSearchParams();
      if (currentFilters.bookingId) query.append("bookingId", currentFilters.bookingId);
      if (currentFilters.date) query.append("date", currentFilters.date);
      if (currentFilters.status) query.append("status", currentFilters.status);

      const res = await axios.get(`http://localhost:5000/api/admin/payments?${query}`, {
        headers: { "x-mock-role": "admin" }
      });

      setPayments(res.data);
    } catch (err) {
      setError("Failed to load payments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setLoading(true);
    fetchPayments(filters);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/payments/${id}`, {
        headers: { "x-mock-role": "admin" }
      });
      fetchPayments();
    } catch (err) {
      alert("Failed to delete payment");
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setEditForm({
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/payments/${editingPayment._id}`,
        {
          ...editingPayment,
          bookingId: editForm.bookingId,
          amount: editForm.amount,
          status: editForm.status
        },
        {
          headers: { "x-mock-role": "admin" }
        }
      );
      setEditingPayment(null);
      fetchPayments();
    } catch (err) {
      alert("Failed to update payment");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💼 Admin: Payment Records</h2>

      {/* Filter bar only shown when NOT editing */}
      {!editingPayment && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            name="bookingId"
            placeholder="Booking ID"
            value={filters.bookingId}
            onChange={handleFilterChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="date"
            placeholder="YYYY-MM"
            value={filters.date}
            onChange={handleFilterChange}
            style={{ marginRight: "10px" }}
          />
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="pending refund">Pending Refund</option>
            <option value="failed">Failed</option>
          </select>
          <button onClick={handleApplyFilters} style={{ marginLeft: "10px" }}>Apply Filters</button>
          <button
            onClick={() => {
              setFilters({ bookingId: "", date: "", status: "" });
              fetchPayments({ bookingId: "", date: "", status: "" });
            }}
            style={{ marginLeft: "10px" }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Edit Form */}
      {editingPayment && (
        <div style={{
          backgroundColor: "#f7f7f7",
          padding: "1.5rem",
          marginBottom: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: "600px"
        }}>
          <h3 style={{ marginBottom: "1rem" }}>✏️ Edit Payment</h3>

          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Booking ID:</strong></label><br />
            <input
              name="bookingId"
              value={editForm.bookingId}
              onChange={handleEditChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Amount:</strong></label><br />
            <input
              name="amount"
              type="number"
              value={editForm.amount}
              onChange={handleEditChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Tourist:</strong></label><br />
            <input
              disabled
              value={editingPayment.touristId?.name || "N/A"}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Business:</strong></label><br />
            <input
              disabled
              value={editingPayment.businessId?.name || "N/A"}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Status:</strong></label><br />
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="pending refund">Pending Refund</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <button onClick={handleSave}>✅ Save</button>
            <button onClick={() => setEditingPayment(null)} style={{ marginLeft: "1rem" }}>🔙 Back</button>
          </div>
        </div>
      )}

      {/* Table View */}
      {!editingPayment && (
        loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Tourist</th>
                <th>Business</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.bookingId}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.touristId?.name || payment.touristId}</td>
                  <td>{payment.businessId?.name || payment.businessId}</td>
                  <td>{payment.status}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleEdit(payment)}>Edit</button>
                    <button onClick={() => handleDelete(payment._id)} style={{ marginLeft: "5px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default AdminPayments;
