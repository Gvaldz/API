const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      next();
    } else {
      return res.status(403).send({ message: 'Access denied' });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRole
};
