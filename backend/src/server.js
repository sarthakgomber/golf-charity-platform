// server.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')

// Load env vars first
dotenv.config()

const env = require('./src/config/environment')
const connectDB = require('./src/config/database')
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware')

// Validate environment
env.validateEnv()

// Connect to MongoDB
connectDB()

const app = express()

// ── SECURITY ─────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── RATE LIMITING ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth routes
  message: { message: 'Too many auth attempts, please try again later.' },
})

app.use(globalLimiter)

// ── BODY PARSING ──────────────────────────────────────────
// Raw body needed for Stripe webhook signature verification
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── ROUTES ────────────────────────────────────────────────
const authRoutes         = require('./src/routes/authRoutes')
const userRoutes         = require('./src/routes/userRoutes')
const charityRoutes      = require('./src/routes/charityRoutes')
const scoreRoutes        = require('./src/routes/scoreRoutes')
const subscriptionRoutes = require('./src/routes/subscriptionRoutes')
const drawRoutes         = require('./src/routes/drawRoutes')
const winnerRoutes       = require('./src/routes/winnerRoutes')
const adminRoutes        = require('./src/routes/adminRoutes')

app.get('/', (req, res) => {
  res.json({
    message: 'Par & Purpose API',
    version: '1.0.0',
    status: 'running',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: env.NODE_ENV,
  })
})

app.use('/api/auth',          authLimiter, authRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/charities',     charityRoutes)
app.use('/api/scores',        scoreRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/draws',         drawRoutes)
app.use('/api/winners',       winnerRoutes)
app.use('/api/admin',         adminRoutes)

// ── ERROR HANDLING ────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── START ─────────────────────────────────────────────────
const PORT = env.PORT
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${env.NODE_ENV}]`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message)
  server.close(() => process.exit(1))
})

module.exports = server