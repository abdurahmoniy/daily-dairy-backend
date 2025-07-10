const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create session log on login
exports.createSession = async (req, res) => {
  const { userId, token } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'] || '';
  try {
    const session = await prisma.sessionLog.create({
      data: { userId, token, ipAddress, userAgent }
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove session log on logout
exports.deleteSession = async (req, res) => {
  const { token } = req.body;
  try {
    await prisma.sessionLog.delete({ where: { token } });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: List all sessions
exports.listSessions = async (req, res) => {
  try {
    const sessions = await prisma.sessionLog.findMany({
      include: { user: true }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Force logout (delete any session)
exports.forceLogout = async (req, res) => {
  const { token } = req.params;
  try {
    await prisma.sessionLog.delete({ where: { token } });
    res.json({ message: 'Session forcibly deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 