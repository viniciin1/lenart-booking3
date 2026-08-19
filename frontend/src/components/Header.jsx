import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Início',           href: '/'          },
  { label: 'Serviços',         href: '/#services'  },
  { label: 'Política de Marcação', href: '/#policies' },
  { label: 'Contacto',         href: '/#contact'   },
]

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location                  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const handleAnchor = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault()
      const id = href.slice(2)
      if (location.pathname !== '/') {
        window.location.href = href
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Left nav – desktop */}
        <nav className={styles.navLeft} aria-label="Navegação principal esquerda">
          {NAV_LINKS.slice(0, 2).map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={e => handleAnchor(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Centered Logo */}
        <Link to="/" className={styles.logo} aria-label="LENART início">
          <span className={styles.logoText}>LENART</span>
          <span className={styles.logoSub}>nail artist</span>
        </Link>

        {/* Right nav – desktop */}
        <nav className={styles.navRight} aria-label="Navegação principal direita">
          {NAV_LINKS.slice(2).map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={e => handleAnchor(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/booking" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.7rem' }}>
            Marcar
          </Link>
        </nav>

        {/* Hamburger – mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer} role="navigation" aria-label="Navegação móvel">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.drawerLink}
              onClick={e => handleAnchor(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/booking" className="btn-primary" style={{ margin: '8px 0', textAlign: 'center' }}>
            Marcar
          </Link>
        </div>
      )}
    </header>
  )
}
