import { useState } from 'react'
import { X, Loader2, Check } from 'lucide-react'
import { blockSlot } from '../../lib/api'
import toast from 'react-hot-toast'
import styles from './BlockSlotModal.module.css'

const TIME_OPTIONS = [
  '09:00','11:00','14:00','16:00','18:00',
]

export default function BlockSlotModal({ token, onClose, onRefresh }) {
  const [date,          setDate]          = useState('')
  const [selectedTimes, setSelectedTimes] = useState([])
  const [reason,        setReason]        = useState('')
  const [allDay,        setAllDay]        = useState(false)
  const [loading,       setLoading]       = useState(false)

  const toggleTime = (t) => {
    setSelectedTimes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date) { toast.error('Por favor selecione uma data.'); return }
    if (!allDay && selectedTimes.length === 0) {
      toast.error('Por favor selecione pelo menos um horário ou marque "Dia inteiro".')
      return
    }

    setLoading(true)
    try {
      if (allDay) {
        await blockSlot(token, { date, time: null, reason, allDay: true })
      } else {
        // Block each selected time
        await Promise.all(
          selectedTimes.map(time =>
            blockSlot(token, { date, time, reason, allDay: false })
          )
        )
      }
      toast.success(
        allDay
          ? 'Dia inteiro bloqueado.'
          : `${selectedTimes.length} horário(s) bloqueado(s).`
      )
      onRefresh()
      onClose()
    } catch {
      toast.error('Erro ao bloquear o horário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Bloquear horários">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bloquear Horário</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Date */}
          <div className="input-group">
            <label className="input-label" htmlFor="block-date">Data</label>
            <input
              id="block-date"
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* All day toggle */}
          <label className={styles.allDayLabel}>
            <input
              type="checkbox"
              checked={allDay}
              onChange={e => {
                setAllDay(e.target.checked)
                setSelectedTimes([])
              }}
              className={styles.checkbox}
            />
            Bloquear dia inteiro
          </label>

          {/* Multiple time selection */}
          {!allDay && (
            <div className="input-group">
              <label className="input-label">
                Horários (selecione um ou mais)
              </label>
              <div className={styles.timesGrid}>
                {TIME_OPTIONS.map(t => {
                  const selected = selectedTimes.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.timeChip} ${selected ? styles.timeChipSelected : ''}`}
                      onClick={() => toggleTime(t)}
                      aria-pressed={selected}
                    >
                      {selected && <Check size={11} strokeWidth={3} />}
                      {t}
                    </button>
                  )
                })}
                {/* Select all / clear buttons */}
                <button
                  type="button"
                  className={styles.selectAll}
                  onClick={() => setSelectedTimes([...TIME_OPTIONS])}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={styles.selectAll}
                  onClick={() => setSelectedTimes([])}
                >
                  Limpar
                </button>
              </div>
              {selectedTimes.length > 0 && (
                <p className={styles.selectedCount}>
                  {selectedTimes.length} horário(s) selecionado(s): {selectedTimes.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="input-group">
            <label className="input-label" htmlFor="block-reason">Motivo (opcional)</label>
            <input
              id="block-reason"
              type="text"
              className="input"
              placeholder="Férias, consulta pessoal…"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? <><Loader2 size={14} className={styles.spinner} /> A bloquear…</>
                : 'Bloquear Horário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
