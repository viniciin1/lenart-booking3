/**
 * In-memory data store.
 *
 * For production replace this with a real database (SQLite via better-sqlite3,
 * PostgreSQL via pg, or MongoDB).  The rest of the codebase talks to this
 * module only through the exported functions, so swapping the backend is
 * straightforward.
 */

// ── In-memory collections ─────────────────────────────────────────
let bookings     = []   // { id, confirmationCode, serviceId, serviceName, date, time,
                        //   clientName, clientPhone, clientEmail, notes,
                        //   status, depositPaid, paymentMethod, createdAt }
let blockedSlots = []   // { id, date, time|null, allDay, reason, createdAt }

// ── Helpers ───────────────────────────────────────────────────────

// Bookings
export function getAllBookings()              { return [...bookings] }
export function getBookingById(id)           { return bookings.find(b => b.id === id) ?? null }
export function getBookingByCode(code)       { return bookings.find(b => b.confirmationCode === code) ?? null }
export function insertBooking(booking)       { bookings.push(booking); return booking }
export function updateBooking(id, patch)     {
  const idx = bookings.findIndex(b => b.id === id)
  if (idx === -1) return null
  bookings[idx] = { ...bookings[idx], ...patch }
  return bookings[idx]
}

// Blocked slots
export function getAllBlockedSlots()         { return [...blockedSlots] }
export function getBlockedSlotById(id)       { return blockedSlots.find(s => s.id === id) ?? null }
export function insertBlockedSlot(slot)      { blockedSlots.push(slot); return slot }
export function deleteBlockedSlot(id)        {
  const idx = blockedSlots.findIndex(s => s.id === id)
  if (idx === -1) return false
  blockedSlots.splice(idx, 1)
  return true
}

// Slot conflict check
export function isSlotTaken(date, time) {
  // Check existing confirmed bookings
  const hasBooking = bookings.some(
    b => b.date === date && b.time === time && b.status !== 'cancelled'
  )
  if (hasBooking) return true

  // Check blocked slots
  const hasBlock = blockedSlots.some(
    s => s.date === date && (s.allDay || s.time === time)
  )
  return hasBlock
}

// Stats
export function computeStats() {
  const now       = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const today     = now.toISOString().split('T')[0]

  const totalBookings      = bookings.length
  const bookingsThisMonth  = bookings.filter(b => b.date.startsWith(thisMonth)).length
  const totalDeposits      = bookings.filter(b => b.depositPaid).length * 10
  const depositsThisMonth  = bookings.filter(b => b.depositPaid && b.date.startsWith(thisMonth)).length * 10
  const upcoming           = bookings.filter(b => b.date >= today && b.status === 'confirmed').length
  const estimatedRevenue   = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.servicePrice ?? 0), 0)

  return {
    totalBookings,
    bookingsThisMonth,
    totalDeposits,
    depositsThisMonth,
    upcoming,
    estimatedRevenue,
  }
}
