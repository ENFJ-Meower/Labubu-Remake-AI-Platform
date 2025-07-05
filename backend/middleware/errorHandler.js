const mongoose = require('mongoose');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'ApiError';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  console.error(`Error ${err.statusCode || 500}: ${err.message}`);
  
  // Development mode - include stack trace
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join('. ');
    error = new ApiError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(message, 401);
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    error = new ApiError(message, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = new ApiError(message, 400);
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError') {
    const message = 'Database connection failed';
    error = new ApiError(message, 503);
  }

  if (err.name === 'MongoTimeoutError') {
    const message = 'Database operation timed out';
    error = new ApiError(message, 503);
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later';
    error = new ApiError(message, 429);
  }

  // Payment errors
  if (err.type === 'StripeCardError') {
    const message = `Payment failed: ${err.message}`;
    error = new ApiError(message, 400);
  }

  if (err.type === 'StripeRateLimitError') {
    const message = 'Payment service temporarily unavailable';
    error = new ApiError(message, 503);
  }

  // External API errors
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    const message = 'External service unavailable';
    error = new ApiError(message, 503);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Error response object
  const errorResponse = {
    success: false,
    error: {
      message: message,
      statusCode: statusCode
    }
  };

  // Include additional error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.name = err.name;
    
    if (err.errors) {
      errorResponse.error.details = err.errors;
    }
  }

  // Include request ID for tracking
  if (req.requestId) {
    errorResponse.error.requestId = req.requestId;
  }

  // Log error to external service in production
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    // Here you would typically log to an external service like Sentry
    console.error('Production error:', {
      message: error.message,
      statusCode: statusCode,
      stack: err.stack,
      requestId: req.requestId,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user ? req.user._id : null
    });
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Not found middleware for unmatched routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async error wrapper to catch async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validation error handler for express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: errorMessages
      }
    });
  }
  
  next();
};

/**
 * Database error handler
 */
const handleDatabaseError = (error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      kind: err.kind
    }));
    
    return new ApiError('Validation failed', 400, true, errors);
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `Duplicate value for field: ${field}`;
    return new ApiError(message, 400);
  }
  
  if (error instanceof mongoose.Error.CastError) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new ApiError(message, 400);
  }
  
  return error;
};

/**
 * Security error handler
 */
const handleSecurityError = (error) => {
  // Don't expose sensitive information in security errors
  if (error.name === 'JsonWebTokenError' || 
      error.name === 'TokenExpiredError' || 
      error.message.includes('password')) {
    return new ApiError('Authentication failed', 401);
  }
  
  return error;
};

/**
 * Rate limit error handler
 */
const handleRateLimitError = (req, res, next) => {
  res.status(429).json({
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later',
      statusCode: 429,
      retryAfter: req.rateLimit ? req.rateLimit.resetTime : null
    }
  });
};

/**
 * CORS error handler
 */
const handleCorsError = (req, res, next) => {
  res.status(403).json({
    success: false,
    error: {
      message: 'CORS policy violation',
      statusCode: 403
    }
  });
};

/**
 * File upload error handler
 */
const handleFileUploadError = (error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: {
        message: 'File size too large',
        statusCode: 413,
        maxSize: req.fileUploadLimit || '10MB'
      }
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Too many files uploaded',
        statusCode: 400,
        maxFiles: req.maxFiles || 10
      }
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Unexpected file field',
        statusCode: 400,
        fieldName: error.field
      }
    });
  }
  
  next(error);
};

/**
 * Payment error handler
 */
const handlePaymentError = (error) => {
  if (error.type === 'StripeCardError') {
    return new ApiError(error.message, 400);
  }
  
  if (error.type === 'StripeRateLimitError') {
    return new ApiError('Payment service rate limit exceeded', 429);
  }
  
  if (error.type === 'StripeInvalidRequestError') {
    return new ApiError('Invalid payment request', 400);
  }
  
  if (error.type === 'StripeAPIError') {
    return new ApiError('Payment service error', 503);
  }
  
  return error;
};

module.exports = {
  ApiError,
  errorHandler,
  notFound,
  asyncHandler,
  handleValidationErrors,
  handleDatabaseError,
  handleSecurityError,
  handleRateLimitError,
  handleCorsError,
  handleFileUploadError,
  handlePaymentError
}; 