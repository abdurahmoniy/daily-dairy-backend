// dairy-backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // Check if session exists in DB
    const session = await prisma.sessionLog.findUnique({ where: { token } });
    if (!session) return res.status(401).json({ message: 'Session expired or invalid' });

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;