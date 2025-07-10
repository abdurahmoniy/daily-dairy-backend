const express = require('express');
const router = express.Router();
const sessionLogController = require('../controllers/sessionLogController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// User session management
router.post('/login', sessionLogController.createSession);
router.post('/logout', sessionLogController.deleteSession);

// Admin session management
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), sessionLogController.listSessions);
router.delete('/:token', authMiddleware, roleMiddleware(['ADMIN']), sessionLogController.forceLogout);

module.exports = router; 