// middleware/authenticateUser.js
module.exports = (req, res, next) => {
    req.user = {
      id: "mockTouristId123",
      role: "tourist",
      email: "tourist@example.com"
    };
    next();
  };
  