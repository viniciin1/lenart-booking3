import { useEffect, useState, useRef } from 'react'
import { ImagePlus, Trash2, Loader2, X } from 'lucide-react'
import { fetchGallery, uploadGalleryImage, deleteGalleryImage } from '../../lib/api'
import toast from 'react-hot-toast'
import styles from './GalleryManager.module.css'

export default function GalleryManager({ token }) {
  const [images,    setImages]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const fileInputRef              = useRef(null)

  const load = async () => {
    try {
      const data = await fetchGallery()
      setImages(data.images ?? [])
    } catch {
      toast.error('Erro ao carregar galeria.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      await Promise.all(files.map(f => uploadGalleryImage(token, f)))
      toast.success(`${files.length} foto(s) adicionada(s)!`)
      await load()
    } catch {
      toast.error('Erro ao fazer upload.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apagar esta foto da galeria?')) return
    setDeleting(id)
    try {
      await deleteGalleryImage(token, id)
      setImages(imgs => imgs.filter(i => i.id !== id))
      toast.success('Foto apagada.')
    } catch {
      toast.error('Erro ao apagar foto.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Galeria de Fotos</p>
          <p className={styles.sub}>{images.length} foto(s) publicada(s)</p>
        </div>
        <label className={`btn-primary ${styles.uploadBtn}`}>
          {uploading
            ? <><Loader2 size={15} className={styles.spinner} /> A carregar…</>
            : <><ImagePlus size={15} /> Adicionar fotos</>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonItem}`} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className={styles.empty}>
          <ImagePlus size={32} className={styles.emptyIcon} />
          <p>Ainda não há fotos na galeria.</p>
          <p className={styles.emptySub}>Clique em "Adicionar fotos" para começar.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map(img => (
            <div key={img.id} className={styles.item}>
              <img src={img.thumbnail} alt="Nail art" className={styles.img} loading="lazy" />
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDelete(img.id)}
                disabled={deleting === img.id}
                aria-label="Apagar foto"
              >
                {deleting === img.id
                  ? <Loader2 size={14} className={styles.spinner} />
                  : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
