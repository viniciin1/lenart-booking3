import { eachDayOfInterval, startOfMonth, endOfMonth, getDay, format, isBefore, isToday } from 'date-fns'
import { isSlotTaken } from '../data/store.js'

/**
 * Horários de trabalho por dia da semana.
 * 0 = Domingo, 1 = Segunda, 2 = Terça, ... 6 = Sábado
 *
 * Regras:
 * - Domingo (0) e Segunda (1) → fechado
 * - Sem horário de almoço (13:00–14:00 removido)
 * - Intervalos de 2h30 entre marcações
 * - 18:00 apenas para Verniz em Gel
 */

// Horários base (de 2h30 em 2h30, sem almoço)
const BASE_SLOTS = ['09:00', '11:30', '14:30', '17:00']

// Horários com o slot das 18:00 incluído (apenas Verniz em Gel)
const GEL_POLISH_SLOTS = ['09:00', '11:30', '14:30', '17:00', '18:00']

// Dias fechados: 0=Domingo, 1=Segunda
const CLOSED_DAYS = [0, 1]

// Horários por dia da semana para serviços normais
const WORK_HOURS = {
  2: BASE_SLOTS,  // Terça
  3: BASE_SLOTS,  // Quarta
  4: BASE_SLOTS,  // Quinta
  5: BASE_SLOTS,  // Sexta
  6: ['09:00', '11:30', '14:30'], // Sábado – sem 17:00
}

// Horários por dia da semana para Verniz em Gel
const GEL_POLISH_HOURS = {
  2: GEL_POLISH_SLOTS,
  3: GEL_POLISH_SLOTS,
  4: GEL_POLISH_SLOTS,
  5: GEL_POLISH_SLOTS,
  6: ['09:00', '11:30', '14:30', '17:00'],
}

/**
 * Retorna os horários disponíveis para um dado serviço, ano e mês.
 * Devolve: { [dateStr]: string[] }
 */
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

    // Dias fechados
    if (CLOSED_DAYS.includes(dow)) continue

    // Selecionar horários conforme serviço
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
