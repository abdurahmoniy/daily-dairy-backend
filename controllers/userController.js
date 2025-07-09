const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        // Don't include passwordHash for security
      }
    });
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving users',
      error: 'USERS_RETRIEVAL_FAILED'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'INVALID_USER_ID'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        // Don't include passwordHash for security
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        userId
      });
    }
    
    res.json({
      message: 'User retrieved successfully',
      user
    });
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving user',
      error: 'USER_RETRIEVAL_FAILED'
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = Number(req.params.id);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'INVALID_USER_ID'
      });
    }

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'USER'];
    if (!role) {
      return res.status(400).json({ 
        message: 'Role is required',
        error: 'ROLE_REQUIRED'
      });
    }
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role',
        error: 'INVALID_ROLE',
        validRoles 
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        userId
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });
    
    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ 
      message: 'Internal server error while updating user role',
      error: 'ROLE_UPDATE_FAILED'
    });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = Number(req.params.id);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'INVALID_USER_ID'
      });
    }

    if (!password) {
      return res.status(400).json({ 
        message: 'Password is required',
        error: 'PASSWORD_REQUIRED'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        error: 'PASSWORD_TOO_SHORT'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        userId
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });
    
    res.json({ 
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error('Update user password error:', err);
    res.status(500).json({ 
      message: 'Internal server error while updating password',
      error: 'PASSWORD_UPDATE_FAILED'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    
    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'INVALID_USER_ID'
      });
    }
    
    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ 
        message: 'Cannot delete your own account',
        error: 'SELF_DELETE_NOT_ALLOWED'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        userId
      });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ 
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ 
      message: 'Internal server error while deleting user',
      error: 'USER_DELETION_FAILED'
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Current user not found',
        error: 'CURRENT_USER_NOT_FOUND'
      });
    }
    
    res.json({
      message: 'Current user retrieved successfully',
      user
    });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving current user',
      error: 'CURRENT_USER_RETRIEVAL_FAILED'
    });
  }
}; 