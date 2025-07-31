const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    logger.info('Authentication successful', {
      userId: decoded.id,
      email: decoded.email,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      path: req.path,
      ip: req.ip,
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Authentication token has expired',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Authentication token is invalid',
      });
    }

    return res.status(401).json({
      error: 'Access Denied',
      message: 'Invalid token',
    });
  }
};

module.exports = { authMiddleware }; 