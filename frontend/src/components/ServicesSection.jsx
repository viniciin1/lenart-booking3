import { Link } from 'react-router-dom'
import { Clock, ChevronRight } from 'lucide-react'
import { SERVICES, formatDuration } from '../lib/services'
import styles from './ServicesSection.module.css'

export default function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-title">
      <div className="container">
        <div className={styles.heading}>
          <p className="section-subtitle">O que ofereço</p>
          <h2 className="section-title" id="services-title">Serviços</h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {SERVICES.map((svc, i) => (
            <article
              key={svc.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.1}s` }}
              aria-label={svc.name}
            >
              {/* Colour swatch header */}
              <div className={styles.swatch} style={{ background: svc.gradient }}>
                <div className={styles.swatchInner} style={{ borderColor: svc.accentColor + '44' }}>
                  <span className={styles.swatchLetter} style={{ color: svc.accentColor }}>
                    {svc.name.charAt(0)}
                  </span>
                </div>
                {svc.popular && (
                  <span className={`badge badge-rose ${styles.popularBadge}`}>Popular</span>
                )}
              </div>

              <div className={styles.body}>
                <p className={styles.tagline} style={{ color: svc.accentColor }}>
                  {svc.tagline}
                </p>
                <h3 className={styles.name}>{svc.name}</h3>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Clock size={13} aria-hidden="true" />
                    {formatDuration(svc.duration)}
                  </span>
                  <span className={styles.price}>
                    {svc.priceNote ?? `€${svc.price}`}
                  </span>
                </div>

                <Link
                  to={`/booking?service=${svc.id}`}
                  className={styles.bookBtn}
                  aria-label={`Marcar ${svc.name}`}
                >
                  Marcar este serviço
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Não tem a certeza qual o serviço mais indicado para si?
          </p>
          <a
            href="https://wa.me/351926154028?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20vosso%20serviço%20de%20manicure!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Pergunte-me no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
