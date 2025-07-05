const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Request logging middleware
 */
const logger = (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  
  // Get real IP address
  const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
  };
  
  // Request details
  const requestDetails = {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl || req.url,
    ip: getClientIP(req),
    userAgent: req.get('User-Agent') || 'Unknown',
    referer: req.get('Referer') || 'Direct',
    userId: null, // Will be set after authentication
    responseTime: null,
    statusCode: null,
    contentLength: null,
    query: req.query,
    params: req.params
  };
  
  // Start time for response time calculation
  const startTime = Date.now();
  
  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    // Calculate response time
    requestDetails.responseTime = Date.now() - startTime;
    requestDetails.statusCode = res.statusCode;
    requestDetails.contentLength = res.get('Content-Length') || (chunk ? chunk.length : 0);
    
    // Add user ID if available
    if (req.user) {
      requestDetails.userId = req.user._id;
    }
    
    // Log the request
    logRequest(requestDetails);
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  // Add request ID to response headers for debugging
  res.set('X-Request-ID', req.requestId);
  
  next();
};

/**
 * Log request details to file and console
 */
const logRequest = (details) => {
  // Create log entry
  const logEntry = {
    ...details,
    level: getLogLevel(details.statusCode),
    message: `${details.method} ${details.url} - ${details.statusCode} - ${details.responseTime}ms`
  };
  
  // Console logging with colors
  logToConsole(logEntry);
  
  // File logging (async, non-blocking)
  if (process.env.NODE_ENV === 'production') {
    logToFile(logEntry);
  }
  
  // Log to external service if configured
  if (process.env.LOGGING_SERVICE_URL) {
    logToExternalService(logEntry);
  }
};

/**
 * Determine log level based on status code
 */
const getLogLevel = (statusCode) => {
  if (statusCode >= 500) return 'error';
  if (statusCode >= 400) return 'warn';
  if (statusCode >= 300) return 'info';
  return 'info';
};

/**
 * Console logging with colors
 */
const logToConsole = (logEntry) => {
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  };
  
  let color = colors.green;
  
  if (logEntry.statusCode >= 500) {
    color = colors.red;
  } else if (logEntry.statusCode >= 400) {
    color = colors.yellow;
  } else if (logEntry.statusCode >= 300) {
    color = colors.cyan;
  }
  
  const timestamp = new Date(logEntry.timestamp).toLocaleString();
  const message = `${color}[${timestamp}] ${logEntry.message}${colors.reset}`;
  
  console.log(message);
  
  // Log additional details in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`  Request ID: ${logEntry.requestId}`);
    console.log(`  IP: ${logEntry.ip}`);
    console.log(`  User Agent: ${logEntry.userAgent}`);
    
    if (logEntry.userId) {
      console.log(`  User ID: ${logEntry.userId}`);
    }
    
    if (Object.keys(logEntry.query).length > 0) {
      console.log(`  Query: ${JSON.stringify(logEntry.query)}`);
    }
    
    if (Object.keys(logEntry.params).length > 0) {
      console.log(`  Params: ${JSON.stringify(logEntry.params)}`);
    }
  }
};

/**
 * File logging
 */
const logToFile = (logEntry) => {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Generate log filename based on date
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `access-${date}.log`);
    
    // Format log entry
    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Append to log file
    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
    
    // Also log errors to separate file
    if (logEntry.level === 'error') {
      const errorFile = path.join(logsDir, `error-${date}.log`);
      fs.appendFile(errorFile, logLine, (err) => {
        if (err) {
          console.error('Error writing to error log file:', err);
        }
      });
    }
    
  } catch (error) {
    console.error('Error in file logging:', error);
  }
};

/**
 * Log to external service (webhook, logging service, etc.)
 */
const logToExternalService = async (logEntry) => {
  try {
    // Only log errors and important events to external service
    if (logEntry.level === 'error' || logEntry.statusCode >= 400) {
      // Implementation would depend on the external service
      // Example: send to webhook, logging service, etc.
      console.log('Would send to external logging service:', logEntry.requestId);
    }
  } catch (error) {
    console.error('Error sending to external logging service:', error);
  }
};

/**
 * Performance monitoring middleware
 */
const performanceLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Log slow requests
    if (duration > 1000) { // Requests taking more than 1 second
      console.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${duration.toFixed(2)}ms`);
    }
    
    // Log performance metrics
    if (process.env.PERFORMANCE_LOGGING === 'true') {
      console.log(`Performance: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

/**
 * Security logging middleware
 */
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script>/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript protocol
  ];
  
  const url = req.originalUrl || req.url;
  const body = JSON.stringify(req.body || {});
  const query = JSON.stringify(req.query || {});
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(body) || pattern.test(query)) {
      console.warn(`Security Alert: Suspicious request detected from ${req.ip}`, {
        requestId: req.requestId,
        method: req.method,
        url: url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      break;
    }
  }
  
  next();
};

/**
 * API usage tracking middleware
 */
const apiUsageLogger = (req, res, next) => {
  // Track API endpoint usage
  const endpoint = `${req.method} ${req.route ? req.route.path : req.path}`;
  
  res.on('finish', () => {
    // Log API usage for analytics
    if (req.user) {
      console.log(`API Usage: User ${req.user._id} accessed ${endpoint}`);
    }
  });
  
  next();
};

/**
 * Database query logging middleware
 */
const dbQueryLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    const mongoose = require('mongoose');
    
    // Log all database queries in development
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.log(`DB Query: ${collectionName}.${method}`, {
        query: JSON.stringify(query),
        doc: doc ? JSON.stringify(doc) : undefined
      });
    });
  }
};

/**
 * Error logging middleware
 */
const errorLogger = (err, req, res, next) => {
  const errorDetails = {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : null
    }
  };
  
  // Log error details
  console.error('Error occurred:', errorDetails);
  
  // Log to file in production
  if (process.env.NODE_ENV === 'production') {
    logToFile({
      ...errorDetails,
      level: 'error',
      message: `Error: ${err.message}`
    });
  }
  
  next(err);
};

/**
 * Cleanup old log files
 */
const cleanupLogs = () => {
  try {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) return;
    
    const files = fs.readdirSync(logsDir);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up log files:', error);
  }
};

// Schedule log cleanup to run daily
if (process.env.NODE_ENV === 'production') {
  setInterval(cleanupLogs, 24 * 60 * 60 * 1000); // Run daily
}

module.exports = {
  logger,
  performanceLogger,
  securityLogger,
  apiUsageLogger,
  dbQueryLogger,
  errorLogger,
  cleanupLogs
}; 