import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { blockSlot } from '../../lib/api'
import toast from 'react-hot-toast'
import styles from './BlockSlotModal.module.css'

const TIME_OPTIONS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30','18:00',
]

export default function BlockSlotModal({ token, onClose, onRefresh }) {
  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [reason,  setReason]  = useState('')
  const [allDay,  setAllDay]  = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date) { toast.error('Por favor selecione uma data.'); return }
    if (!allDay && !time) { toast.error('Por favor selecione uma hora ou marque "Dia inteiro".'); return }

    setLoading(true)
    try {
      await blockSlot(token, { date, time: allDay ? null : time, reason, allDay })
      toast.success('Horário bloqueado com sucesso.')
      onRefresh()
      onClose()
    } catch {
      toast.error('Erro ao bloquear o horário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Bloquear um horário">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bloquear Horário</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
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

          <label className={styles.allDayLabel}>
            <input
              type="checkbox"
              checked={allDay}
              onChange={e => setAllDay(e.target.checked)}
              className={styles.checkbox}
            />
            Bloquear dia inteiro
          </label>

          {!allDay && (
            <div className="input-group">
              <label className="input-label" htmlFor="block-time">Hora</label>
              <select
                id="block-time"
                className="input"
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                <option value="">Selecionar hora…</option>
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

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
