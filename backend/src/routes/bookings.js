import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import {
  insertBooking,
  getBookingById,
  getBookingByCode,
  isSlotTaken,
} from '../data/store.js'
import { getService } from '../data/services.js'
import { sendConfirmationEmail } from '../lib/mailer.js'

const router = Router()

/**
 * POST /api/bookings
 * Creates a pending booking. Deposit is handled by the payments route.
 */
router.post('/', async (req, res) => {
  const {
    serviceId, date, time,
    clientName, clientPhone, clientEmail,
    notes, paymentMethod,
  } = req.body

  // Validate required fields
  if (!serviceId || !date || !time || !clientName || !clientPhone || !clientEmail) {
    return res.status(400).json({ message: 'Missing required booking fields.' })
  }

  // Validate service
  const service = getService(serviceId)
  if (!service) {
    return res.status(404).json({ message: `Unknown service: ${serviceId}` })
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' })
  }

  // Check slot availability
  if (isSlotTaken(date, time)) {
    return res.status(409).json({ message: 'This slot is no longer available. Please choose another.' })
  }

  const confirmationCode = generateCode()
  const booking = insertBooking({
    id:               uuidv4(),
    confirmationCode,
    serviceId,
    serviceName:      service.name,
    servicePrice:     service.price,
    date,
    time,
    clientName:       clientName.trim(),
    clientPhone:      clientPhone.trim(),
    clientEmail:      clientEmail.trim().toLowerCase(),
    notes:            notes?.trim() ?? '',
    status:           'pending',  // becomes 'confirmed' after deposit
    depositPaid:      false,
    paymentMethod:    paymentMethod ?? 'stripe',
    createdAt:        new Date().toISOString(),
  })

  res.status(201).json({
    id:               booking.id,
    confirmationCode: booking.confirmationCode,
    status:           booking.status,
  })
})

/**
 * GET /api/bookings/confirm/:code
 * Returns booking details by confirmation code.
 */
router.get('/confirm/:code', (req, res) => {
  const booking = getBookingByCode(req.params.code.toUpperCase())
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }
  // Return safe subset (no internal IDs)
  const { id: _id, ...safe } = booking
  res.json(safe)
})

// ── Helper ────────────────────────────────────────────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default router
