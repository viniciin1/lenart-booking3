import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import {
  getAllBookings,
  getBookingById,
  updateBooking,
  getAllBlockedSlots,
  getBlockedSlotById,
  insertBlockedSlot,
  deleteBlockedSlot,
  computeStats,
} from '../data/store.js'
import { requireAuth, signToken, checkPassword, hashPassword } from '../lib/auth.js'

const router = Router()

// ── Auth ──────────────────────────────────────────────────────────

let adminPasswordHash = null

async function getPasswordHash() {
  if (adminPasswordHash) return adminPasswordHash

  if (process.env.ADMIN_PASSWORD_HASH) {
    adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    return adminPasswordHash
  }

  // Hash the plain-text password on first use
  const plain = process.env.ADMIN_PASSWORD ?? 'changeme123'
  adminPasswordHash = await hashPassword(plain)
  console.log('[admin] Admin password hash generated. Set ADMIN_PASSWORD_HASH in .env for persistence.')
  return adminPasswordHash
}

/**
 * POST /api/admin/login
 */
router.post('/login', async (req, res) => {
  const { password } = req.body
  if (!password) {
    return res.status(400).json({ message: 'Password is required.' })
  }

  const hash  = await getPasswordHash()
  const valid = await checkPassword(password, hash)

  if (!valid) {
    // Add a small delay to slow brute-force
    await new Promise(r => setTimeout(r, 500))
    return res.status(401).json({ message: 'Incorrect password.' })
  }

  const token = signToken({ role: 'admin' })
  res.json({ token })
})

// ── All routes below require authentication ───────────────────────
router.use(requireAuth)

/**
 * GET /api/admin/stats
 */
router.get('/stats', (_req, res) => {
  res.json(computeStats())
})

/**
 * GET /api/admin/bookings?status=confirmed
 */
router.get('/bookings', (req, res) => {
  let bookings = getAllBookings()

  // Optional status filter
  if (req.query.status) {
    bookings = bookings.filter(b => b.status === req.query.status)
  }

  // Sort newest first
  bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const blockedSlots = getAllBlockedSlots()

  res.json({ bookings, blockedSlots })
})

/**
 * PATCH /api/admin/bookings/:id/cancel
 */
router.patch('/bookings/:id/cancel', (req, res) => {
  const booking = getBookingById(req.params.id)
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }
  if (booking.status === 'cancelled') {
    return res.status(409).json({ message: 'Booking is already cancelled.' })
  }

  const updated = updateBooking(booking.id, { status: 'cancelled' })
  res.json(updated)
})

/**
 * PATCH /api/admin/bookings/:id/complete
 */
router.patch('/bookings/:id/complete', (req, res) => {
  const booking = getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })

  const updated = updateBooking(booking.id, { status: 'completed' })
  res.json(updated)
})

/**
 * POST /api/admin/block
 * Body: { date, time?, allDay, reason? }
 */
router.post('/block', (req, res) => {
  const { date, time, allDay, reason } = req.body

  if (!date) {
    return res.status(400).json({ message: 'date is required.' })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' })
  }
  if (!allDay && !time) {
    return res.status(400).json({ message: 'Either time or allDay=true is required.' })
  }

  const slot = insertBlockedSlot({
    id:        uuidv4(),
    date,
    time:      allDay ? null : time,
    allDay:    Boolean(allDay),
    reason:    reason?.trim() ?? '',
    createdAt: new Date().toISOString(),
  })

  res.status(201).json(slot)
})

/**
 * DELETE /api/admin/block/:id
 */
router.delete('/block/:id', (req, res) => {
  const deleted = deleteBlockedSlot(req.params.id)
  if (!deleted) {
    return res.status(404).json({ message: 'Blocked slot not found.' })
  }
  res.json({ success: true })
})

export default router
