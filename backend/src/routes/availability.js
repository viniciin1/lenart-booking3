import { Router } from 'express'
import { getMonthAvailability } from '../lib/availability.js'
import { getService } from '../data/services.js'

const router = Router()

/**
 * GET /api/availability?serviceId=gel&year=2026&month=8
 * Returns { [dateStr]: ['10:00', ...] }
 */
router.get('/', (req, res) => {
  const { serviceId, year, month } = req.query

  if (!serviceId || !year || !month) {
    return res.status(400).json({ message: 'serviceId, year, and month are required.' })
  }

  if (!getService(serviceId)) {
    return res.status(404).json({ message: `Unknown service: ${serviceId}` })
  }

  const y = parseInt(year, 10)
  const m = parseInt(month, 10)

  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    return res.status(400).json({ message: 'Invalid year or month.' })
  }

  const availability = getMonthAvailability(serviceId, y, m)
  res.json(availability)
})

export default router
