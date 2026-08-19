import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import { CreditCard, Smartphone, Building2, Loader2, ShieldCheck } from 'lucide-react'
import { createBooking, createCheckoutSession } from '../../lib/api'
import { calcTotal } from '../../lib/services'
import toast from 'react-hot-toast'
import styles from './Step4Payment.module.css'

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Cartão', description: 'Visa, Mastercard, American Express, MB WAY', icon: CreditCard },
]

export default function Step4Payment({ state, onConfirm }) {
  const { service, extras = [], date, time, client } = state
  const [method, setMethod]   = useState('stripe')
  const [loading, setLoading] = useState(false)

  const total = calcTotal(service, extras)

  const handlePay = async () => {
    setLoading(true)
    try {
      const booking = await createBooking({
        serviceId:     service.id,
        serviceName:   service.name,
        extras:        extras.map(e => ({ id: e.id, name: e.name, price: e.price, qty: e.qty })),
        date,
        time,
        clientName:    client.name,
        clientPhone:   client.phone,
        clientEmail:   client.email,
        notes:         client.notes,
        paymentMethod: method,
      })

      if (method === 'stripe') {
        const { url } = await createCheckoutSession(booking.id)
        window.location.href = url
      } else {
        onConfirm(booking.id, booking.confirmationCode)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Pagamento falhado. Por favor tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Confirme a sua marcação</h2>
        <p className={styles.sub}>É necessário um sinal de €10 para confirmar a sua marcação.</p>
      </div>

      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Resumo do Pedido</p>

        {/* Main service */}
        <div className={styles.summaryRow}>
          <span>{service.name}</span>
          <span>€{service.price}</span>
        </div>

        {/* Extras */}
        {extras.map(e => (
          <div key={e.id} className={`${styles.summaryRow} ${styles.summaryExtra}`}>
            <span>{e.name} × {e.qty}</span>
            <span>€{(e.price * e.qty).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}

        <div className={styles.summaryRow + ' ' + styles.summaryMuted}>
          <span>{format(parseISO(date), "EEE, d MMM", { locale: pt })} · {time}</span>
          <span>{client.name}</span>
        </div>

        <div className={styles.divider} />

        {extras.length > 0 && (
          <div className={styles.summaryRow}>
            <span>Total do serviço</span>
            <span>€{total.toFixed(2).replace('.', ',')}</span>
          </div>
        )}

        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>Sinal a pagar agora</span>
          <span className={styles.totalPrice}>€10,00</span>
        </div>
        <p className={styles.depositNote}>
          Saldo restante (€{(total - 10).toFixed(2).replace('.', ',')}) pago no dia da consulta.
        </p>
      </div>

      <div className={styles.methods}>
        <p className={styles.methodsTitle}>Método de pagamento</p>
        <div className={styles.methodsGrid}>
          {PAYMENT_METHODS.map(m => (
            <button
              key={m.id}
              type="button"
              className={`${styles.methodCard} ${method === m.id ? styles.methodSelected : ''}`}
              onClick={() => setMethod(m.id)}
              aria-pressed={method === m.id}
            >
              <m.icon size={20} aria-hidden="true" />
              <span className={styles.methodLabel}>{m.label}</span>
              <span className={styles.methodDesc}>{m.description}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`btn-primary ${styles.payBtn}`}
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? (
          <><Loader2 size={16} className={styles.spinner} aria-hidden="true" /> A processar…</>
        ) : (
          <><ShieldCheck size={16} aria-hidden="true" /> Pagar Sinal de €10</>
        )}
      </button>

      <p className={styles.secureNote}>
        <ShieldCheck size={12} aria-hidden="true" />
        Pagamento seguro. Os dados do seu cartão nunca são armazenados.
      </p>
    </div>
  )
}
