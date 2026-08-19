import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, RefreshCw, Search, CalendarX, Loader2, Menu, X } from 'lucide-react'
import { fetchAdminBookings, fetchAdminStats, unblockSlot } from '../lib/api'
import AdminStats from '../components/admin/AdminStats'
import BookingsTable from '../components/admin/BookingsTable'
import BlockSlotModal from '../components/admin/BlockSlotModal'
import toast from 'react-hot-toast'
import styles from './AdminPage.module.css'

const TABS = ['Todas', 'Próximas', 'Concluídas', 'Canceladas']

const STATUS_FILTER = {
  Todas:      undefined,
  Próximas:   'confirmed',
  Concluídas: 'completed',
  Canceladas: 'cancelled',
}

export default function AdminPage() {
  const navigate   = useNavigate()
  const token      = sessionStorage.getItem('admin_token')

  const [stats,        setStats]        = useState(null)
  const [bookings,     setBookings]     = useState([])
  const [blockedSlots, setBlockedSlots] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [tab,          setTab]          = useState('Todas')
  const [search,       setSearch]       = useState('')
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [showBlock,    setShowBlock]    = useState(false)

  useEffect(() => {
    if (!token) navigate('/admin/login')
  }, [token, navigate])

  const loadData = useCallback(async (silent = false) => {
    if (!token) return
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const [s, b] = await Promise.all([
        fetchAdminStats(token),
        fetchAdminBookings(token, { status: STATUS_FILTER[tab] }),
      ])
      setStats(s)
      setBookings(b.bookings ?? [])
      setBlockedSlots(b.blockedSlots ?? [])
    } catch (err) {
      if (err?.response?.status === 401) {
        sessionStorage.removeItem('admin_token')
        navigate('/admin/login')
      } else {
        toast.error('Erro ao carregar os dados.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token, tab, navigate])

  useEffect(() => { loadData() }, [loadData])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const handleUnblock = async (slotId) => {
    try {
      await unblockSlot(token, slotId)
      toast.success('Horário desbloqueado.')
      loadData(true)
    } catch {
      toast.error('Erro ao desbloquear horário.')
    }
  }

  const filtered = bookings.filter(b => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      b.clientName?.toLowerCase().includes(q) ||
      b.clientEmail?.toLowerCase().includes(q) ||
      b.clientPhone?.includes(q) ||
      b.confirmationCode?.toLowerCase().includes(q) ||
      b.serviceName?.toLowerCase().includes(q)
    )
  })

  return (
    <div className={styles.root}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>LENART</span>
          <span className={styles.logoSub}>admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map(t => (
            <button
              key={t}
              type="button"
              className={`${styles.navItem} ${tab === t ? styles.navItemActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarActions}>
          <button type="button" className={`btn-secondary ${styles.blockBtn}`} onClick={() => setShowBlock(true)}>
            <CalendarX size={15} />
            Bloquear Horário
          </button>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile hamburger */}
            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Abrir menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className={styles.mainTitle}>Painel</h1>
              <p className={styles.mainSub}>Gerir marcações e horários</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={() => loadData(true)}
              disabled={refreshing}
              aria-label="Atualizar dados"
            >
              <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinning} />
            <p>A carregar painel…</p>
          </div>
        ) : (
          <>
            <AdminStats stats={stats} />

            {blockedSlots.length > 0 && (
              <div className={styles.blockedSection}>
                <p className={styles.sectionLabel}>Horários Bloqueados</p>
                <div className={styles.blockedList}>
                  {blockedSlots.map(s => (
                    <div key={s.id} className={styles.blockedItem}>
                      <span className="badge badge-red">
                        {s.allDay ? `${s.date} — Dia inteiro` : `${s.date} ${s.time}`}
                      </span>
                      {s.reason && <span className={styles.blockedReason}>{s.reason}</span>}
                      <button type="button" className={styles.unblockBtn} onClick={() => handleUnblock(s.id)}>
                        Desbloquear
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.tableHeader}>
              <p className={styles.sectionLabel}>
                Marcações
                <span className={styles.bookingCount}>{filtered.length}</span>
              </p>
              <div className={styles.searchWrap}>
                <Search size={14} className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="search"
                  className={`input ${styles.searchInput}`}
                  placeholder="Pesquisar por nome, e-mail, código…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Pesquisar marcações"
                />
              </div>
            </div>

            <BookingsTable bookings={filtered} token={token} onRefresh={() => loadData(true)} />
          </>
        )}
      </main>

      {showBlock && (
        <BlockSlotModal token={token} onClose={() => setShowBlock(false)} onRefresh={() => loadData(true)} />
      )}
    </div>
  )
}
