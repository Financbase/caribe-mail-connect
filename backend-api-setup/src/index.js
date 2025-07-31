const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const expressWs = require('express-ws');
require('dotenv').config();

const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const { validateRequest } = require('./middleware/validation');

// Import routes
const partnerRoutes = require('./routes/partners');
const vendorRoutes = require('./routes/vendors');
const affiliateRoutes = require('./routes/affiliates');
const integrationRoutes = require('./routes/integrations');
const analyticsRoutes = require('./routes/analytics');
const contractRoutes = require('./routes/contracts');
const commissionRoutes = require('./routes/commissions');
const notificationRoutes = require('./routes/notifications');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// WebSocket setup
const wsInstance = expressWs(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Partner Management API',
      version: '1.0.0',
      description: 'API for managing partners, vendors, affiliates, and integrations',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/partners', authMiddleware, partnerRoutes);
app.use('/api/vendors', authMiddleware, vendorRoutes);
app.use('/api/affiliates', authMiddleware, affiliateRoutes);
app.use('/api/integrations', authMiddleware, integrationRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/contracts', authMiddleware, contractRoutes);
app.use('/api/commissions', authMiddleware, commissionRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// WebSocket endpoint for real-time notifications
app.ws('/ws/notifications/:partnerId', (ws, req) => {
  const { partnerId } = req.params;
  const token = req.query.token;

  // Validate token
  if (!token) {
    ws.close(1008, 'Authentication required');
    return;
  }

  try {
    // Add to notification room
    ws.partnerId = partnerId;
    ws.isAlive = true;

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to notification service',
      timestamp: new Date().toISOString(),
    }));

    // Handle incoming messages
    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        
        switch (data.type) {
          case 'heartbeat':
            ws.isAlive = true;
            ws.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() }));
            break;
          case 'subscribe':
            // Handle subscription to specific notification types
            break;
          default:
            logger.warn('Unknown WebSocket message type', { type: data.type, partnerId });
        }
      } catch (error) {
        logger.error('WebSocket message parsing error', { error: error.message, partnerId });
      }
    });

    // Handle connection close
    ws.on('close', () => {
      logger.info('WebSocket connection closed', { partnerId });
    });

    // Handle errors
    ws.on('error', (error) => {
      logger.error('WebSocket error', { error: error.message, partnerId });
    });

  } catch (error) {
    logger.error('WebSocket authentication error', { error: error.message, partnerId });
    ws.close(1008, 'Authentication failed');
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Partner Management API server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

module.exports = app; 