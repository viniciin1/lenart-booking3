import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { CheckCircle2, Calendar, Clock, Sparkles, MessageCircle } from 'lucide-react'
import { calcTotal } from '../../lib/services'
import styles from './Step5Confirmation.module.css'

export default function Step5Confirmation({ state }) {
  const { service, extras = [], date, time, client, confirmationCode } = state
  const total = calcTotal(service, extras)

  const extrasSummary = extras.length > 0
    ? extras.map(e => `${e.name} ×${e.qty}`).join(', ')
    : null

  const whatsappMsg = encodeURIComponent(
    `Olá! Acabei de marcar um serviço de ${service.name}${extrasSummary ? ` + ${extrasSummary}` : ''} para ${format(parseISO(date), "EEEE, d 'de' MMMM", { locale: pt })} às ${time}.\nConfirmação: ${confirmationCode}`
  )

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap} aria-hidden="true">
        <CheckCircle2 size={56} className={styles.icon} strokeWidth={1.4} />
        <Sparkles size={20} className={styles.sparkle1} />
        <Sparkles size={14} className={styles.sparkle2} />
      </div>

      <h2 className={styles.title}>Marcação confirmada!</h2>
      <p className={styles.sub}>
        A sua consulta foi confirmada. Até breve!
      </p>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.code}>#{confirmationCode}</span>
          <span className="badge badge-green">Confirmado</span>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <Sparkles size={14} className={styles.detailIcon} aria-hidden="true" />
            <span className={styles.detailLabel}>Serviço</span>
            <span className={styles.detailValue}>{service.name}</span>
          </div>
          <div className={styles.detailRow}>
            <Calendar size={14} className={styles.detailIcon} aria-hidden="true" />
            <span className={styles.detailLabel}>Data</span>
            <span className={styles.detailValue}>
              {format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
            </span>
          </div>
          <div className={styles.detailRow}>
            <Clock size={14} className={styles.detailIcon} aria-hidden="true" />
            <span className={styles.detailLabel}>Hora</span>
            <span className={styles.detailValue}>{time}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.clientInfo}>
          <p className={styles.clientName}>{client.name}</p>
          <p className={styles.clientContact}>{client.email}</p>
          <p className={styles.clientContact}>{client.phone}</p>
        </div>

        <div className={styles.depositBadge}>
          <span>Sinal de €10 pago</span>
          <span className={styles.remaining}>€{(total - 10).toFixed(2).replace('.', ',')} restantes no dia</span>
        </div>

        {extras.length > 0 && (
          <div className={styles.extrasSummary}>
            <span className={styles.extrasLabel}>Extras incluídos:</span>
            {extras.map(e => (
              <span key={e.id} className={styles.extrasItem}>
                {e.name} ×{e.qty} — €{(e.price * e.qty).toFixed(2).replace('.', ',')}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.nextSteps}>
        <p className={styles.nextTitle}>O que acontece a seguir?</p>
        <ul className={styles.nextList}>
          <li>Uma confirmação foi enviada para <strong>{client.email}</strong></li>
          <li>Por favor chegue a horas — tolerância de 15 minutos</li>
          <li>Contacte-me pelo WhatsApp para qualquer alteração</li>
        </ul>
      </div>

      <div className={styles.actions}>
        <a
          href={`https://wa.me/351926154028?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Enviar mensagem no WhatsApp
        </a>
        <Link to="/" className="btn-secondary">
          Voltar ao Início
        </Link>
      </div>

      <p className={styles.signoff}>Obrigada por marcar comigo. ♥</p>
    </div>
  )
}
