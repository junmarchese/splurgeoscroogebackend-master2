const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); 

function ensureLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err); 
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded; 
    return next(); 
  });
}

module.exports = { ensureLoggedIn };
