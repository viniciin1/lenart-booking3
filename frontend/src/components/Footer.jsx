import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MapPin } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>LENART</span>
          <span className={styles.logoSub}>nail artist</span>
          <p className={styles.tagline}>
            Unhas feitas com amor,<br />uma marcação de cada vez.
          </p>
        </div>

        {/* Quick links */}
        <div className={styles.col}>
          <p className={styles.colTitle}>Navegar</p>
          <a href="/#services" className={styles.footerLink}>Serviços</a>
          <a href="/#policies" className={styles.footerLink}>Política de Marcação</a>
          <Link to="/booking" className={styles.footerLink}>Marcar Consulta</Link>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <p className={styles.colTitle}>Contacto</p>
          <a href="https://www.instagram.com/lenart_cardoso_" target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
            <Instagram size={14} />
            @lenart_cardoso_
          </a>
          <a href="https://wa.me/351926154028" target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
            <Phone size={14} />
            +351 926 154 028
          </a>
          <a href="mailto:lenartcardoso311@gmail.com" className={styles.contactRow}>
            <Mail size={14} />
            lenartcardoso311@gmail.com
          </a>
          <a
            href="https://maps.google.com/?q=Praceta+Ary+dos+Santos+10,+2620-070+Póvoa+de+Santo+Adrião"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            <MapPin size={14} />
            <span>Torre 2, 9-B · Praceta Ary dos Santos 10<br />2620-070 Póvoa de Santo Adrião</span>
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} LENART. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
