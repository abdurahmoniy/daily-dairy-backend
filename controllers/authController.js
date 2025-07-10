const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, role = 'USER' } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        errors: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters long' 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'USER'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role',
        validRoles 
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Username already exists',
        error: 'USERNAME_EXISTS'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, passwordHash: hashedPassword, role }
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Internal server error during registration',
      error: 'REGISTRATION_FAILED'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        errors: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid username or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ 
        message: 'Invalid username or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Log the session
    try {
      await prisma.sessionLog.create({
        data: {
          userId: user.id,
          token,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || ''
        }
      });
    } catch (logErr) {
      console.error('Session log error:', logErr);
    }
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Internal server error during login',
      error: 'LOGIN_FAILED'
    });
  }
};

