import { eachDayOfInterval, startOfMonth, endOfMonth, getDay, format, parseISO, isBefore } from 'date-fns'
import { isSlotTaken } from '../data/store.js'

/** Working hours – adjust to match the nail artist's schedule */
const WORK_HOURS = {
  // 0=Sun, 1=Mon, … 6=Sat
  1: ['10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
  2: ['10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
  3: ['10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
  4: ['10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
  5: ['10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00'],
  6: ['10:00','10:30','11:00','11:30','12:00','12:30'],
  // 0: [] — closed on Sundays
}

/**
 * Returns available time slots for a given service, year, and month.
 * Returns: { [dateStr]: string[] }
 */
export function getMonthAvailability(serviceId, year, month) {
  const today     = new Date()
  const start     = startOfMonth(new Date(year, month - 1, 1))
  const end       = endOfMonth(start)
  const days      = eachDayOfInterval({ start, end })
  const result    = {}

  for (const day of days) {
    // Skip past days
    if (isBefore(day, today) && day.toDateString() !== today.toDateString()) continue

    const dow   = getDay(day)
    const slots = WORK_HOURS[dow] ?? []
    if (!slots.length) continue

    const dateStr     = format(day, 'yyyy-MM-dd')
    const freeSlots   = slots.filter(time => !isSlotTaken(dateStr, time))
    if (freeSlots.length > 0) {
      result[dateStr] = freeSlots
    }
  }

  return result
}
