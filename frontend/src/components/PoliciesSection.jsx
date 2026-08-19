import styles from './PoliciesSection.module.css'

const POLICIES = [
  {
    id: 'deposit',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M11 22c0-1.1.9-2 2-2h2l1-2h4l1 2h2a2 2 0 0 1 2 2v1H11v-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <circle cx="18" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 12v-2M18 18.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Sinal de Reserva',
    text: 'Para reservar a sua marcação é necessário um sinal de €10, que será descontado no valor total do serviço no dia.',
  },
  {
    id: 'cancellation',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="7" y="10" width="22" height="19" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 15h22" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M12 7v4M24 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14 20l8 5M22 20l-8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cancelamentos e Faltas',
    text: 'Em caso de falta ou cancelamento de última hora, o sinal não é reembolsável e não pode ser aplicado a uma marcação futura.',
  },
  {
    id: 'other-techs',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 11v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="18" cy="23.5" r="1.3" fill="currentColor"/>
      </svg>
    ),
    title: 'Trabalho de Outras Profissionais',
    text: 'Não realizamos manutenções de trabalho feito por outras profissionais. Nesses casos, o serviço será cobrado como primeira aplicação.',
  },
  {
    id: 'lateness',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="19" r="11" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 13v6l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Tolerância de Atraso',
    text: 'Período de tolerância: 15 minutos. Após este tempo, a marcação poderá ser cancelada e o sinal será perdido.',
  },
]

export default function PoliciesSection() {
  return (
    <section className={styles.section} id="policies" aria-labelledby="policies-title">
      <div className={styles.topLine} aria-hidden="true" />

      <div className="container">
        <div className={styles.heading}>
          <p className="section-subtitle">Por favor leia antes de marcar</p>
          <h2 className={`section-title ${styles.title}`} id="policies-title">
            Informações de Marcação
          </h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {POLICIES.map((p, i) => (
            <article
              key={p.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.12}s` }}
              aria-label={p.title}
            >
              <div className={styles.iconWrap} aria-hidden="true">
                {p.icon}
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </article>
          ))}
        </div>

        <p className={styles.closing} aria-label="Mensagem de encerramento">
          Obrigada pela sua compreensão e por respeitar o meu trabalho.&nbsp;♥
        </p>
      </div>

      <div className={styles.bottomLine} aria-hidden="true" />
    </section>
  )
}
