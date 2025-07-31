const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500,
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation Error',
      status: 400,
      details: err.details || err.message,
    };
  } else if (err.name === 'UnauthorizedError') {
    error = {
      message: 'Unauthorized',
      status: 401,
    };
  } else if (err.name === 'ForbiddenError') {
    error = {
      message: 'Forbidden',
      status: 403,
    };
  } else if (err.name === 'NotFoundError') {
    error = {
      message: 'Not Found',
      status: 404,
    };
  } else if (err.code === '23505') { // PostgreSQL unique constraint violation
    error = {
      message: 'Duplicate Entry',
      status: 409,
      details: 'A record with this information already exists',
    };
  } else if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    error = {
      message: 'Reference Error',
      status: 400,
      details: 'Referenced record does not exist',
    };
  } else if (err.code === '23502') { // PostgreSQL not null constraint violation
    error = {
      message: 'Missing Required Field',
      status: 400,
      details: 'Required field is missing',
    };
  } else if (err.message) {
    error.message = err.message;
    if (err.status) {
      error.status = err.status;
    }
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    details: error.details,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

module.exports = { errorHandler }; 