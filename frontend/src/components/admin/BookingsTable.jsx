import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import { XCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cancelBooking } from '../../lib/api'
import toast from 'react-hot-toast'
import styles from './BookingsTable.module.css'

const STATUS_MAP = {
  confirmed:  { label: 'Confirmada',  cls: 'badge-green' },
  pending:    { label: 'Pendente',    cls: 'badge-rose'  },
  cancelled:  { label: 'Cancelada',   cls: 'badge-red'   },
  completed:  { label: 'Concluída',   cls: 'badge-gold'  },
}

export default function BookingsTable({ bookings, token, onRefresh }) {
  const [expanded,   setExpanded]   = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const handleCancel = async (id) => {
    if (!window.confirm('Cancelar esta marcação? O sinal será marcado como não reembolsável.')) return
    setCancelling(id)
    try {
      await cancelBooking(token, id)
      toast.success('Marcação cancelada.')
      onRefresh()
    } catch {
      toast.error('Erro ao cancelar a marcação.')
    } finally {
      setCancelling(null)
    }
  }

  if (!bookings?.length) {
    return (
      <div className={styles.empty}>
        <p>Nenhuma marcação encontrada.</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data e Hora</th>
            <th>Estado</th>
            <th>Sinal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const status     = STATUS_MAP[b.status] ?? STATUS_MAP.pending
            const isExpanded = expanded === b.id
            return (
              <>
                <tr key={b.id} className={isExpanded ? styles.rowExpanded : ''}>
                  <td className={styles.code}>#{b.confirmationCode}</td>
                  <td>
                    <p className={styles.clientName}>{b.clientName}</p>
                    <p className={styles.clientSub}>{b.clientEmail}</p>
                  </td>
                  <td>{b.serviceName}</td>
                  <td>
                    <p>{format(parseISO(b.date), 'dd MMM yyyy', { locale: pt })}</p>
                    <p className={styles.clientSub}>{b.time}</p>
                  </td>
                  <td>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </td>
                  <td className={styles.deposit}>
                    {b.depositPaid
                      ? <span className="badge badge-green">Pago €10</span>
                      : <span className="badge badge-rose">Pendente</span>}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <a
                        href={`https://wa.me/${b.clientPhone?.replace(/\D/g, '')}?text=Olá+${encodeURIComponent(b.clientName)}!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                        title="WhatsApp cliente"
                      >
                        <MessageCircle size={15} />
                      </a>

                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.cancelBtn}`}
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                          title="Cancelar marcação"
                          aria-label={`Cancelar marcação ${b.confirmationCode}`}
                        >
                          <XCircle size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => setExpanded(isExpanded ? null : b.id)}
                        title={isExpanded ? 'Recolher' : 'Ver notas'}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${b.id}-exp`} className={styles.expandedRow}>
                    <td colSpan={7}>
                      <div className={styles.expandedContent}>
                        <p className={styles.expandedLabel}>Observações</p>
                        <p className={styles.expandedText}>{b.notes || 'Sem observações.'}</p>
                        <p className={styles.expandedLabel} style={{ marginTop: 8 }}>Método de pagamento</p>
                        <p className={styles.expandedText}>{b.paymentMethod ?? '—'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
