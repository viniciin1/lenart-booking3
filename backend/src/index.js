import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import availabilityRouter from './routes/availability.js'
import bookingsRouter     from './routes/bookings.js'
import paymentsRouter     from './routes/payments.js'
import adminRouter        from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT ?? 3001

// ── Stripe webhook needs the raw body BEFORE json() ───────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// ── Global middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/availability', availabilityRouter)
app.use('/api/bookings',     bookingsRouter)
app.use('/api/payments',     paymentsRouter)
app.use('/api/admin',        adminRouter)

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[error]', err)
  res.status(err.status ?? 500).json({
    message: err.message ?? 'Internal server error.',
  })
})

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  LENART Booking API                  ║
  ║  http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  `)
})
