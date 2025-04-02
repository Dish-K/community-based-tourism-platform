"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./admin-payments.css"

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [filters, setFilters] = useState({
    bookingId: "",
    date: "",
    status: "",
  })

  const [editingPayment, setEditingPayment] = useState(null)
  const [editForm, setEditForm] = useState({
    bookingId: "",
    amount: "",
    status: "",
  })

  const fetchPayments = async (currentFilters = filters) => {
    try {
      const query = new URLSearchParams()
      if (currentFilters.bookingId) query.append("bookingId", currentFilters.bookingId)
      if (currentFilters.date) query.append("date", currentFilters.date)
      if (currentFilters.status) query.append("status", currentFilters.status)

      const res = await axios.get(`http://localhost:5000/api/admin/payments?${query}`, {
        headers: { "x-mock-role": "admin" },
      })

      setPayments(res.data)
    } catch (err) {
      setError("Failed to load payments")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleApplyFilters = () => {
    setLoading(true)
    fetchPayments(filters)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return

    try {
      await axios.delete(`http://localhost:5000/api/admin/payments/${id}`, {
        headers: { "x-mock-role": "admin" },
      })
      fetchPayments()
    } catch (err) {
      alert("Failed to delete payment")
    }
  }

  const handleEdit = (payment) => {
    setEditingPayment(payment)
    setEditForm({
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
    })
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/payments/${editingPayment._id}`,
        {
          ...editingPayment,
          bookingId: editForm.bookingId,
          amount: editForm.amount,
          status: editForm.status,
        },
        {
          headers: { "x-mock-role": "admin" },
        },
      )
      setEditingPayment(null)
      fetchPayments()
    } catch (err) {
      alert("Failed to update payment")
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-paid"
      case "refunded":
        return "status-refunded"
      case "pending refund":
        return "status-pending"
      default:
        return "status-failed"
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">
            <span className="admin-title-icon">💼</span> Admin: Payment Records
          </h1>
        </div>

        {/* Filter bar only shown when NOT editing */}
        {!editingPayment && (
          <div className="filter-section">
            <div className="filter-grid">
              <div className="filter-item">
                <label className="filter-label">Booking ID</label>
                <input
                  name="bookingId"
                  placeholder="Enter booking ID"
                  value={filters.bookingId}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
              <div className="filter-item">
                <label className="filter-label">Date (YYYY-MM)</label>
                <input
                  name="date"
                  placeholder="YYYY-MM"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
              <div className="filter-item">
                <label className="filter-label">Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="pending refund">Pending Refund</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="filter-buttons">
                <button onClick={handleApplyFilters} className="btn-primary">
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setFilters({ bookingId: "", date: "", status: "" })
                    fetchPayments({ bookingId: "", date: "", status: "" })
                  }}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editingPayment && (
          <div className="edit-form">
            <h2 className="edit-form-title">
              <span className="edit-form-title-icon">✏️</span> Edit Payment
            </h2>

            <div className="form-fields">
              <div className="form-field">
                <label className="form-label">Booking ID</label>
                <input name="bookingId" value={editForm.bookingId} onChange={handleEditChange} className="form-input" />
              </div>

              <div className="form-field">
                <label className="form-label">Amount</label>
                <input
                  name="amount"
                  type="number"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Tourist</label>
                <input disabled value={editingPayment.touristId?.name || "N/A"} className="form-input-disabled" />
              </div>

              <div className="form-field">
                <label className="form-label">Business</label>
                <input disabled value={editingPayment.businessId?.name || "N/A"} className="form-input-disabled" />
              </div>

              <div className="form-field">
                <label className="form-label">Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange} className="form-select">
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="pending refund">Pending Refund</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="form-actions">
                <button onClick={() => setEditingPayment(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {!editingPayment && (
          <div className="table-container">
            {loading ? (
              <div className="state-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading payments...</p>
              </div>
            ) : error ? (
              <div className="state-container">
                <div className="error-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p className="error-text">{error}</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="state-container">
                <p className="empty-text">No payment records found.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Booking ID</th>
                      <th className="table-header-cell">Amount</th>
                      <th className="table-header-cell">Tourist</th>
                      <th className="table-header-cell">Business</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Created</th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {payments.map((payment) => (
                      <tr key={payment._id} className="table-row">
                        <td className="table-cell cell-id">{payment.bookingId}</td>
                        <td className="table-cell cell-amount">${payment.amount}</td>
                        <td className="table-cell cell-text">{payment.touristId?.name || payment.touristId}</td>
                        <td className="table-cell cell-text">{payment.businessId?.name || payment.businessId}</td>
                        <td className="table-cell">
                          <span className={`status-badge ${getStatusClass(payment.status)}`}>{payment.status}</span>
                        </td>
                        <td className="table-cell cell-text">{new Date(payment.createdAt).toLocaleString()}</td>
                        <td className="table-cell">
                          <button onClick={() => handleEdit(payment)} className="action-edit">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(payment._id)} className="action-delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPayments

