import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { adminLogin } from '../lib/api'
import toast from 'react-hot-toast'
import styles from './AdminLoginPage.module.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    try {
      const { token } = await adminLogin(password)
      sessionStorage.setItem('admin_token', token)
      navigate('/admin')
    } catch {
      toast.error('Palavra-passe incorreta. Por favor tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Lock size={24} />
        </div>
        <h1 className={styles.title}>LENART Admin</h1>
        <p className={styles.sub}>Introduza a sua palavra-passe para aceder ao painel.</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="admin-password">Palavra-passe</label>
            <div className={styles.passwordWrap}>
              <input
                id="admin-password"
                type={show ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShow(s => !s)}
                aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading
              ? <><Loader2 size={16} className={styles.spinner} /> A entrar…</>
              : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
