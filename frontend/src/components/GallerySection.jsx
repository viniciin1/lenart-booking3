import { useEffect, useState } from 'react'
import { fetchGallery } from '../lib/api'
import { X } from 'lucide-react'
import styles from './GallerySection.module.css'

export default function GallerySection() {
  const [images,    setImages]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [lightbox,  setLightbox]  = useState(null) // selected image

  useEffect(() => {
    fetchGallery()
      .then(d => setImages(d.images ?? []))
      .catch(() => {}) // silently fail if no images yet
      .finally(() => setLoading(false))
  }, [])

  // Don't render section if no images and not loading
  if (!loading && images.length === 0) return null

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

        {loading ? (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonItem}`} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((img, i) => (
              <button
                key={img.id}
                className={styles.item}
                onClick={() => setLightbox(img)}
                aria-label={`Ver foto ${i + 1}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={img.thumbnail}
                  alt={`Nail art ${i + 1}`}
                  className={styles.img}
                  loading="lazy"
                />
                <div className={styles.overlay} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

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
