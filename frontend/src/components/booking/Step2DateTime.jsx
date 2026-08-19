import { useState, useEffect, useCallback } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isBefore, isToday, isSameDay, addMonths, subMonths,
} from 'date-fns'
import { pt } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { fetchAvailability } from '../../lib/api'
import styles from './Step2DateTime.module.css'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function Step2DateTime({ service, onSelect }) {
  const today = new Date()
  const [viewMonth, setViewMonth]       = useState(today)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availability, setAvailability] = useState({})
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  const loadAvailability = useCallback(async (month) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAvailability(
        service.id,
        month.getFullYear(),
        month.getMonth() + 1
      )
      setAvailability(data)
    } catch {
      setError('Não foi possível carregar a disponibilidade. Por favor tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [service.id])

  useEffect(() => {
    loadAvailability(viewMonth)
  }, [viewMonth, loadAvailability])

  const monthStart  = startOfMonth(viewMonth)
  const monthEnd    = endOfMonth(viewMonth)
  const days        = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad    = getDay(monthStart)

  const isDisabled  = (day) => isBefore(day, today) && !isToday(day)
  const slotsForDate = (day) => availability[format(day, 'yyyy-MM-dd')] ?? []
  const hasSlots    = (day) => slotsForDate(day).length > 0

  const handleDayClick = (day) => {
    if (isDisabled(day) || !hasSlots(day)) return
    setSelectedDate(day)
    setSelectedTime(null)
  }

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return
    onSelect(format(selectedDate, 'yyyy-MM-dd'), selectedTime)
  }

  const goToPrev = () => setViewMonth(m => subMonths(m, 1))
  const goToNext = () => setViewMonth(m => addMonths(m, 1))
  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() ||
                    viewMonth.getMonth() > today.getMonth()

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Escolha a data e hora</h2>
        <p className={styles.sub}>
          Horários disponíveis para <strong>{service.name}</strong>
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Calendar ── */}
        <div className={styles.calendar}>
          <div className={styles.monthNav}>
            <button onClick={goToPrev} disabled={!canGoPrev} className={styles.navBtn} aria-label="Mês anterior" type="button">
              <ChevronLeft size={18} />
            </button>
            <span className={styles.monthLabel}>
              {format(viewMonth, 'MMMM yyyy', { locale: pt })}
            </span>
            <button onClick={goToNext} className={styles.navBtn} aria-label="Próximo mês" type="button">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map(d => (
              <span key={d} className={styles.weekday}>{d}</span>
            ))}
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className={`skeleton ${styles.skeletonCell}`} />
              ))}
            </div>
          ) : (
            <div className={styles.daysGrid}>
              {Array.from({ length: startPad }).map((_, i) => (
                <span key={`pad-${i}`} className={styles.padCell} aria-hidden="true" />
              ))}

              {days.map(day => {
                const disabled  = isDisabled(day)
                const slots     = slotsForDate(day)
                const available = slots.length > 0
                const sel       = selectedDate && isSameDay(day, selectedDate)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={disabled || !available}
                    onClick={() => handleDayClick(day)}
                    className={`
                      ${styles.dayCell}
                      ${disabled ? styles.dayCellDisabled : ''}
                      ${available && !disabled ? styles.dayCellAvailable : ''}
                      ${sel ? styles.dayCellSelected : ''}
                      ${isToday(day) ? styles.dayCellToday : ''}
                    `}
                    aria-label={`${format(day, 'd MMMM', { locale: pt })}, ${available ? `${slots.length} horários disponíveis` : 'indisponível'}`}
                    aria-pressed={!!sel}
                  >
                    {format(day, 'd')}
                    {available && !disabled && (
                      <span className={styles.dot} aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* ── Time slots ── */}
        <div className={styles.timesPanel}>
          {!selectedDate ? (
            <div className={styles.timesEmpty}>
              <Clock size={28} className={styles.timesIcon} aria-hidden="true" />
              <p>Selecione uma data para ver os horários disponíveis</p>
            </div>
          ) : (
            <>
              <p className={styles.timesDate}>
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: pt })}
              </p>
              <div className={styles.timesGrid} role="listbox" aria-label="Horários disponíveis">
                {slotsForDate(selectedDate).map(t => (
                  <button
                    key={t}
                    type="button"
                    role="option"
                    aria-selected={selectedTime === t}
                    className={`${styles.timeChip} ${selectedTime === t ? styles.timeChipSelected : ''}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className="btn-primary"
          disabled={!selectedDate || !selectedTime}
          onClick={handleConfirm}
        >
          Continuar com {selectedDate && selectedTime
            ? `${format(selectedDate, "d 'de' MMM", { locale: pt })} às ${selectedTime}`
            : 'o horário selecionado'}
        </button>
      </div>
    </div>
  )
}
