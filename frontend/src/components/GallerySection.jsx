import { useEffect, useState } from 'react'
import { fetchGallery } from '../lib/api'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './GallerySection.module.css'

export default function GallerySection() {
  const [images,   setImages]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [active,   setActive]   = useState(0)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetchGallery()
      .then(d => {
        const imgs = d.images ?? []
        setImages(imgs)
        setActive(Math.floor(imgs.length / 2))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && images.length === 0) return null

  const prev = () => setActive(a => Math.max(0, a - 1))
  const next = () => setActive(a => Math.min(images.length - 1, a + 1))

  return (
    <section className={styles.section} id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className={styles.heading}>
          <p className="section-subtitle">O meu trabalho</p>
          <h2 className="section-title" id="gallery-title">Galeria</h2>
          <div className="divider" />
          <p className={styles.intro}>
            Cada conjunto é único. Inspire-se para a sua próxima marcação.
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`skeleton ${styles.skeletonItem}`}
              style={{ flex: i === 2 ? '3' : '1' }}
            />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.accordion} role="list">
            {images.map((img, i) => (
              <div
                key={img.id}
                role="listitem"
                className={`${styles.panel} ${i === active ? styles.panelActive : ''}`}
                onClick={() => {
                  if (i === active) setLightbox(img)
                  else setActive(i)
                }}
                aria-label={i === active ? `Foto ${i + 1} — clique para ampliar` : `Ver foto ${i + 1}`}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') setActive(i) }}
              >
                <img
                  src={i === active ? img.url : img.thumbnail}
                  alt={`Nail art ${i + 1}`}
                  className={styles.panelImg}
                  loading="lazy"
                />
                {i !== active && (
                  <div className={styles.panelOverlay} aria-hidden="true" />
                )}
                {i === active && (
                  <div className={styles.panelBadge} aria-hidden="true">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.badgeDivider} />
                    <span>{String(images.length).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={prev}
              disabled={active === 0}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <div className={styles.dots}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.navBtn}
              onClick={next}
              disabled={active === images.length - 1}
              aria-label="Próxima foto"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
          <img
            src={lightbox.url}
            alt="Nail art ampliada"
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
