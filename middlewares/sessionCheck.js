const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function sessionCheck(req, res, next) {
  // Assume token is in Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  // Check if session is active
  const session = await prisma.sessionLog.findUnique({ where: { token } });
  if (!session) return res.status(401).json({ message: 'Session expired or invalid' });

  // Optionally, attach session/user info to req
  req.session = session;
  next();
}; 