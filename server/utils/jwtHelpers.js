// server/utils/jwtHelpers.js
const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'yourfallbacksecret';
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// Extract user from JWT token in request headers
function getUserFromToken(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = { getUserFromToken };
