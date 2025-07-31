const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Partner login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validateRequest,
], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // For testing purposes, accept any valid email/password
    // In production, this would validate against the database
    if (email && password && password.length >= 6) {
      // Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          id: 'test-partner-id',
          email: email,
          role: 'partner'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );
      
      const refreshToken = jwt.sign(
        { 
          id: 'test-partner-id',
          email: email,
          type: 'refresh'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );
      
      // Mock partner data
      const partner = {
        id: 'test-partner-id',
        name: 'Test Partner',
        email: email,
        type: 'strategic',
        status: 'active',
        rating: 4.5,
      };
      
      logger.info('Partner login successful', { email });
      
      res.json({
        partner,
        token,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes
      });
    } else {
      res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Email or password is incorrect',
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', [
  body('refreshToken').notEmpty(),
  validateRequest,
], async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    const jwt = require('jsonwebtoken');
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Invalid refresh token',
      });
    }
    
    // Generate new access token
    const token = jwt.sign(
      { 
        id: decoded.id,
        email: decoded.email,
        role: 'partner'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    
    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { 
        id: decoded.id,
        email: decoded.email,
        type: 'refresh'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    // Mock partner data
    const partner = {
      id: decoded.id,
      name: 'Test Partner',
      email: decoded.email,
      type: 'strategic',
      status: 'active',
      rating: 4.5,
    };
    
    logger.info('Token refreshed successfully', { email: decoded.email });
    
    res.json({
      partner,
      token,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60, // 15 minutes
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Invalid refresh token',
      });
    }
    next(error);
  }
});

module.exports = router; 