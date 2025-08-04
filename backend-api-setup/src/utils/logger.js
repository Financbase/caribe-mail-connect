const winston = require('winston');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { format } = winston;
const { combine, timestamp, printf, json, colorize, simple } = format;

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true, mode: 0o755 });
}

// Security: Redact sensitive information from logs
const redactSensitiveInfo = format((info) => {
  const redactedInfo = { ...info };
  
  // List of fields to redact
  const sensitiveFields = [
    'password',
    'token',
    'authorization',
    'api_key',
    'apikey',
    'secret',
    'access_token',
    'refresh_token',
    'credit_card',
    'ssn',
    'phone',
    'email',
  ];

  // Redact sensitive fields
  Object.keys(redactedInfo).forEach((key) => {
    const keyLower = key.toLowerCase();
    if (sensitiveFields.some(field => keyLower.includes(field))) {
      redactedInfo[key] = '***REDACTED***';
    }
  });

  // Redact sensitive information from error objects
  if (redactedInfo.stack) {
    redactedInfo.stack = redactedInfo.stack
      .replace(/(password|token|api[_-]?key|secret|access[_-]?token|refresh[_-]?token|credit[_-]?card|ssn|phone|email)=[^&\s]+/gi, '$1=***REDACTED***')
      .replace(/(\"password\"|\"token\"|\"api[_-]?key\"|\"secret\"|\"access[_-]?token\"|\"refresh[_-]?token\"|\"credit[_-]?card\"|\"ssn\"|\"phone\"|\"email\"):\s*\"[^\"]+\"/gi, '$1:"***REDACTED***"');
  }

  return redactedInfo;
});

// Add request ID to logs for better traceability
const addRequestId = format((info) => {
  if (!info.requestId) {
    info.requestId = crypto.randomUUID();
  }
  return info;
});

// Define log format
const logFormat = combine(
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  addRequestId(),
  redactSensitiveInfo(),
  json({
    // Handle circular references
    replacer: (key, value) => {
      if (value instanceof Error) {
        const error = {};
        Object.getOwnPropertyNames(value).forEach((k) => {
          error[k] = value[k];
        });
        return error;
      }
      return value;
    },
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'partner-management-api',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
    }),
    // Separate audit log for security-related events
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'info',
      format: combine(
        timestamp(),
        addRequestId(),
        redactSensitiveInfo(),
        json()
      ),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
    }),
  ],
  exitOnError: false, // Don't exit on handled exceptions
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  const consoleFormat = printf(({ level, message, timestamp, requestId, ...meta }) => {
    let log = `${timestamp} [${level}] [${requestId || 'NO-REQUEST-ID'}] ${message}`;
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return log;
  });

  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      addRequestId(),
      redactSensitiveInfo(),
      consoleFormat
    ),
    level: process.env.CONSOLE_LOG_LEVEL || 'debug',
  }));
}

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = { logger }; 