// src/middleware/errorMiddleware.js
const env = require('../config/environment')

// 404 handler — place before errorHandler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Global error handler — place last in middleware chain
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status is still 200 (unhandled throw)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' })
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(400).json({ message: err.message })
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}

module.exports = { notFound, errorHandler }