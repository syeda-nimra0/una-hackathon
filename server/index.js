require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const app = express()

// ── Security & middleware ───────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
  process.env.CLIENT_URL,
  'https://unaassistant.netlify.app',
  'https://una-hackathon-j2g8.vercel.app/',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
].filter(Boolean)
    if (!origin || allowed.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(morgan('dev'))

// Stripe webhook MUST come before express.json()
const paymentRoutes = require('./routes/payment')
app.use('/api/payment', paymentRoutes)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'))
app.use('/api/student', require('./routes/student'))
app.use('/api/teacher', require('./routes/teacher'))

// Root + Health check
app.get('/', (req, res) => res.json({ message: 'NEXUS LMS API is running', version: '1.0.0' }))
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// ── Database & Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected')
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message)
    process.exit(1)
  })
