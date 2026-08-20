import { Link } from 'react-router-dom'
import { ArrowRight, Instagram } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PoliciesSection from '../components/PoliciesSection'
import ServicesSection from '../components/ServicesSection'
import GallerySection from '../components/GallerySection'
import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="Hero">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>
              Nail Artist · Póvoa de Santo Adrião
            </p>
            <h1 className={styles.heroTitle}>
              Unhas feitas<br />
              <em>à sua medida.</em>
            </h1>
            <p className={styles.heroSub}>
              Serviços premium de gel, verniz em gel e nail art — personalizados para si,
              marcados com facilidade. Cada conjunto é uma pequena obra de arte.
            </p>
            <div className={styles.heroCta}>
              <Link to="/booking" className="btn-primary">
                Marcar consulta
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href="#services"
                className="btn-secondary"
                onClick={e => {
                  e.preventDefault()
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Ver serviços
              </a>
            </div>
          </div>

          <div className={styles.heroDecor} aria-hidden="true">
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.heroMonogram}>L</div>
          </div>
        </div>

        <div className={styles.socialProof}>
          <a
            href="https://www.instagram.com/lenart_cardoso_"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igLink}
            aria-label="Seguir no Instagram"
          >
            <Instagram size={16} aria-hidden="true" />
            @lenart_cardoso_
          </a>
          <span className={styles.socialDivider} aria-hidden="true" />
          <span className={styles.socialText}>Marque diretamente — sem DMs necessários</span>
        </div>
      </section>

      {/* ── Services ── */}
      <ServicesSection />

      {/* ── Gallery ── */}
      <GallerySection />

      {/* ── Policies ── */}
      <PoliciesSection />

      <Footer />
    </>
  )
}
