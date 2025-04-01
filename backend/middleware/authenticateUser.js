// middleware/authenticateUser.js

// Mock user authentication (for dev/testing only)
const verifyToken = (req, res, next) => {
  const role = req.headers['x-mock-role'] || 'tourist'; // default role: tourist

  req.user = {
    id: `mock${role.charAt(0).toUpperCase() + role.slice(1)}Id123`,
    role: role,
    email: `${role}@example.com`
  };

  next();
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// ✅ Clean named export
module.exports = {
  verifyToken,
  isAdmin
};
