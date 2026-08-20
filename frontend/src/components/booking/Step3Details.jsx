import { useState, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import { User, Phone, Mail, MessageSquare, Calendar, Clock, ImagePlus, X } from 'lucide-react'
import styles from './Step3Details.module.css'

const INITIAL = { name: '', phone: '', email: '', notes: '', inspirationImage: null }

function validate(fields) {
  const errors = {}
  if (!fields.name.trim())  errors.name  = 'O nome é obrigatório'
  if (!fields.phone.trim()) errors.phone = 'O telemóvel / WhatsApp é obrigatório'
  if (!fields.email.trim()) errors.email = 'O e-mail é obrigatório'
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Introduza um e-mail válido'
  return errors
}

export default function Step3Details({ service, date, time, initial, onSubmit }) {
  const [fields, setFields]     = useState(initial ?? INITIAL)
  const [errors, setErrors]     = useState({})
  const [touched, setTouched]   = useState({})
  const [preview, setPreview]   = useState(null)
  const fileInputRef            = useRef(null)

  const set = (key, val) => {
    setFields(f => ({ ...f, [key]: val }))
    if (touched[key]) {
      const errs = validate({ ...fields, [key]: val })
      setErrors(e => ({ ...e, [key]: errs[key] }))
    }
  }

  const blur = (key) => {
    setTouched(t => ({ ...t, [key]: true }))
    const errs = validate(fields)
    setErrors(e => ({ ...e, [key]: errs[key] }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem não pode ter mais de 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setFields(f => ({ ...f, inspirationImage: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setPreview(null)
    setFields(f => ({ ...f, inspirationImage: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) {
      setErrors(errs)
      setTouched({ name: true, phone: true, email: true })
      return
    }
    onSubmit(fields)
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Os seus dados</h2>
        <p className={styles.sub}>Quase lá — só precisamos de alguns dados para confirmar a sua marcação.</p>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryIcon}><Calendar size={14} /></span>
          <span>{format(parseISO(date), "EEEE, d 'de' MMM yyyy", { locale: pt })}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryIcon}><Clock size={14} /></span>
          <span>{time}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryService}>{service.name}</span>
          <span className={styles.summaryPrice}>€{service.price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={`input-group ${styles.field}`}>
          <label className="input-label" htmlFor="client-name">
            <User size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Nome Completo
          </label>
          <input
            id="client-name"
            type="text"
            className={`input ${errors.name && touched.name ? styles.inputError : ''}`}
            placeholder="Ana Silva"
            value={fields.name}
            onChange={e => set('name', e.target.value)}
            onBlur={() => blur('name')}
            autoComplete="name"
            required
          />
          {errors.name && touched.name && (
            <p className={styles.errorMsg} role="alert">{errors.name}</p>
          )}
        </div>

        <div className={`input-group ${styles.field}`}>
          <label className="input-label" htmlFor="client-phone">
            <Phone size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Telemóvel / WhatsApp
          </label>
          <input
            id="client-phone"
            type="tel"
            className={`input ${errors.phone && touched.phone ? styles.inputError : ''}`}
            placeholder="+351 926 154 028"
            value={fields.phone}
            onChange={e => set('phone', e.target.value)}
            onBlur={() => blur('phone')}
            autoComplete="tel"
            required
          />
          {errors.phone && touched.phone && (
            <p className={styles.errorMsg} role="alert">{errors.phone}</p>
          )}
        </div>

        <div className={`input-group ${styles.field}`}>
          <label className="input-label" htmlFor="client-email">
            <Mail size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Endereço de E-mail
          </label>
          <input
            id="client-email"
            type="email"
            className={`input ${errors.email && touched.email ? styles.inputError : ''}`}
            placeholder="ana@exemplo.com"
            value={fields.email}
            onChange={e => set('email', e.target.value)}
            onBlur={() => blur('email')}
            autoComplete="email"
            required
          />
          {errors.email && touched.email && (
            <p className={styles.errorMsg} role="alert">{errors.email}</p>
          )}
        </div>

        <div className={`input-group ${styles.field}`}>
          <label className="input-label" htmlFor="client-notes">
            <MessageSquare size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Observações (opcional)
          </label>
          <textarea
            id="client-notes"
            className="input"
            placeholder="Ideias de nail art, alergias ou pedidos especiais…"
            rows={3}
            value={fields.notes}
            onChange={e => set('notes', e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Image upload */}
        <div className={`input-group ${styles.field}`}>
          <label className="input-label">
            <ImagePlus size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Imagem de inspiração (opcional)
          </label>

          {!preview ? (
            <label className={styles.uploadArea} htmlFor="inspiration-image">
              <ImagePlus size={24} className={styles.uploadIcon} aria-hidden="true" />
              <span className={styles.uploadText}>Clique para adicionar uma foto</span>
              <span className={styles.uploadSub}>JPG, PNG ou WEBP · máx. 5MB</span>
              <input
                id="inspiration-image"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={styles.fileInput}
                onChange={handleImage}
                aria-label="Carregar imagem de inspiração"
              />
            </label>
          ) : (
            <div className={styles.previewWrap}>
              <img src={preview} alt="Imagem de inspiração" className={styles.previewImg} />
              <button
                type="button"
                className={styles.removeImg}
                onClick={removeImage}
                aria-label="Remover imagem"
              >
                <X size={14} />
                Remover
              </button>
            </div>
          )}
        </div>

        <div className={styles.depositNote}>
          <span className={styles.depositIcon}>€</span>
          <p>
            É necessário um <strong>sinal de €10</strong> para confirmar a sua marcação.
            Será descontado no total no dia da consulta.
          </p>
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
          Continuar para o Pagamento
        </button>
      </form>
    </div>
  )
}
