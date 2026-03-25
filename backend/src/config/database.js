// src/config/database.js
const mongoose = require('mongoose')
const env = require('./environment')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    // Retry after 5 seconds
    console.log('Retrying connection in 5 seconds...')
    setTimeout(connectDB, 5000)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect...')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed on app termination')
  process.exit(0)
})

module.exports = connectDB