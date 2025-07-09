const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'MISSING_REQUIRED_FIELDS',
        missingFields
      });
    }
    
    next();
  };
};

const validateId = (paramName) => {
  return (req, res, next) => {
    const id = Number(req.params[paramName]);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Invalid ${paramName} ID format`,
        error: `INVALID_${paramName.toUpperCase()}_ID`
      });
    }
    
    req.params[paramName] = id; // Convert to number for consistency
    next();
  };
};

const validatePagination = () => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (page < 1) {
      return res.status(400).json({
        message: 'Page number must be greater than 0',
        error: 'INVALID_PAGE_NUMBER'
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        message: 'Limit must be between 1 and 100',
        error: 'INVALID_LIMIT'
      });
    }
    
    req.pagination = { page, limit };
    next();
  };
};

const validateDateRange = () => {
  return (req, res, next) => {
    const { startDate, endDate } = req.query;
    
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          message: 'Invalid start date format',
          error: 'INVALID_START_DATE'
        });
      }
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({
          message: 'Invalid end date format',
          error: 'INVALID_END_DATE'
        });
      }
    }
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        return res.status(400).json({
          message: 'Start date must be before end date',
          error: 'INVALID_DATE_RANGE'
        });
      }
    }
    
    next();
  };
};

module.exports = {
  validateRequiredFields,
  validateId,
  validatePagination,
  validateDateRange
}; 