import { eachDayOfInterval, startOfMonth, endOfMonth, getDay, format, isBefore } from 'date-fns'
import { isSlotTaken } from '../data/store.js'

/**
 * Regras:
 * - Domingo (0) e Segunda (1) → fechado
 * - Intervalo mínimo de 2 horas entre marcações
 * - Sem almoço (13:00–14:00 removido)
 * - 18:00 apenas para Verniz em Gel
 */

// Dias fechados
const CLOSED_DAYS = [0, 1] // 0=Domingo, 1=Segunda

// Horários com 2h de intervalo, sem almoço
// 09:00 → 11:00 → (almoço removido) → 14:00 → 16:00 → 18:00(só gel polish)
const BASE_SLOTS        = ['09:00', '11:00', '14:00', '16:00']
const GEL_POLISH_SLOTS  = ['09:00', '11:00', '14:00', '16:00', '18:00']
const SATURDAY_BASE     = ['09:00', '11:00', '14:00', '16:00']
const SATURDAY_GEL      = ['09:00', '11:00', '14:00', '16:00', '18:00']

// Horários por dia para serviços normais
const WORK_HOURS = {
  2: BASE_SLOTS,     // Terça
  3: BASE_SLOTS,     // Quarta
  4: BASE_SLOTS,     // Quinta
  5: BASE_SLOTS,     // Sexta
  6: SATURDAY_BASE,  // Sábado
}

// Horários por dia para Verniz em Gel
const GEL_POLISH_HOURS = {
  2: GEL_POLISH_SLOTS,
  3: GEL_POLISH_SLOTS,
  4: GEL_POLISH_SLOTS,
  5: GEL_POLISH_SLOTS,
  6: SATURDAY_GEL,
}

export function getMonthAvailability(serviceId, year, month) {
  const today  = new Date()
  const start  = startOfMonth(new Date(year, month - 1, 1))
  const end    = endOfMonth(start)
  const days   = eachDayOfInterval({ start, end })
  const result = {}

  const isGelPolish = serviceId === 'gel-polish'

  for (const day of days) {
    // Ignorar dias passados
    if (isBefore(day, today) && day.toDateString() !== today.toDateString()) continue

    const dow = getDay(day)

    // Dias fechados (Domingo e Segunda)
    if (CLOSED_DAYS.includes(dow)) continue

    const slots = isGelPolish
      ? (GEL_POLISH_HOURS[dow] ?? [])
      : (WORK_HOURS[dow] ?? [])

    if (!slots.length) continue

    const dateStr   = format(day, 'yyyy-MM-dd')
    const freeSlots = slots.filter(time => !isSlotTaken(dateStr, time))

    if (freeSlots.length > 0) {
      result[dateStr] = freeSlots
    }
  }

  return result
}
