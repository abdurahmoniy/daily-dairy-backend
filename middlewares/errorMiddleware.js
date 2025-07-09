const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'Resource already exists',
      error: 'DUPLICATE_ENTRY',
      field: err.meta?.target?.[0] || 'unknown'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Resource not found',
      error: 'RESOURCE_NOT_FOUND'
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      message: 'Cannot delete resource with associated data',
      error: 'FOREIGN_KEY_CONSTRAINT'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      error: 'VALIDATION_ERROR',
      details: err.message
    });
  }

  // Default error
  res.status(500).json({
    message: 'Internal server error',
    error: 'INTERNAL_SERVER_ERROR'
  });
};

module.exports = errorMiddleware; 