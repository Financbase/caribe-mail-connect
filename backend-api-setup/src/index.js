const express = require('express');
const cors = require('cors');
const compression = require('compression');
const expressWs = require('express-ws');
require('dotenv').config();

// Initialize database connection
const { testConnection } = require('./config/database');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const { 
  securityHeaders, 
  apiLimiter, 
  validateRequest, 
  sanitizeInput, 
  securityLogger 
} = require('./middleware/security');

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

// Apply security middleware
app.use(securityHeaders);
app.use(securityLogger);
app.use(sanitizeInput);

// Define allowed HTTP methods
const ALLOWED_HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS'
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [];
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      logger.warn('CORS violation', { origin, allowedOrigins });
      // Don't send detailed error messages in production
      const error = new Error(process.env.NODE_ENV === 'production' 
        ? 'Not allowed by CORS' 
        : `Origin '${origin}' not allowed by CORS`);
      callback(error);
    }
  },
  credentials: true,
  methods: ALLOWED_HTTP_METHODS,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 600, // 10 minutes
};

app.use(cors(corsOptions));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

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
  // TODO: Add type validation for req.query.token
  // TODO: Add type validation for req.query.token
  // TODO: Add type validation for req.query.token
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

// Test database connection before starting the server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`Allowed origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  // Perform cleanup if needed
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  // Consider restarting the server or handling the error appropriately
});

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;