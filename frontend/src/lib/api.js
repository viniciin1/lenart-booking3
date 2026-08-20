import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Availability ──────────────────────────────────────────────────
export async function fetchAvailability(serviceId, year, month) {
  const { data } = await api.get('/availability', {
    params: { serviceId, year, month },
  })
  return data // { [dateStr]: ['10:00','11:00',...] }
}

// ── Bookings ──────────────────────────────────────────────────────
export async function createBooking(payload) {
  const { data } = await api.post('/bookings', payload)
  return data // { id, confirmationCode, ... }
}

export async function getBookingByCode(code) {
  const { data } = await api.get(`/bookings/confirm/${code}`)
  return data
}

// ── Payment (Stripe) ─────────────────────────────────────────────
export async function createCheckoutSession(bookingId) {
  const { data } = await api.post('/payments/checkout', { bookingId })
  return data // { url }
}

// ── Gallery ──────────────────────────────────────────────────────
export async function fetchGallery() {
  const { data } = await api.get('/gallery')
  return data // { images: [...] }
}

export async function uploadGalleryImage(token, file) {
  const form = new FormData()
  form.append('image', file)
  const { data } = await api.post('/gallery', form, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteGalleryImage(token, id) {
  const { data } = await api.delete(`/gallery/${id}`, adminHeaders(token))
  return data
}
export async function adminLogin(password) {
  const { data } = await api.post('/admin/login', { password })
  return data // { token }
}

export function adminHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function fetchAdminBookings(token, params = {}) {
  const { data } = await api.get('/admin/bookings', {
    ...adminHeaders(token),
    params,
  })
  return data
}

export async function fetchAdminStats(token) {
  const { data } = await api.get('/admin/stats', adminHeaders(token))
  return data
}

export async function blockSlot(token, payload) {
  const { data } = await api.post('/admin/block', payload, adminHeaders(token))
  return data
}

export async function unblockSlot(token, slotId) {
  const { data } = await api.delete(`/admin/block/${slotId}`, adminHeaders(token))
  return data
}

export async function cancelBooking(token, bookingId) {
  const { data } = await api.patch(
    `/admin/bookings/${bookingId}/cancel`,
    {},
    adminHeaders(token)
  )
  return data
}
