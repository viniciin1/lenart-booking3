import { TrendingUp, CalendarCheck, DollarSign, Clock } from 'lucide-react'
import styles from './AdminStats.module.css'

export default function AdminStats({ stats }) {
  if (!stats) return null

  const cards = [
    {
      icon: CalendarCheck,
      label: 'Total de Marcações',
      value: stats.totalBookings ?? 0,
      sub: `${stats.bookingsThisMonth ?? 0} este mês`,
      color: '#E09F9C',
    },
    {
      icon: DollarSign,
      label: 'Sinais Recebidos',
      value: `€${stats.totalDeposits ?? 0}`,
      sub: `€${stats.depositsThisMonth ?? 0} este mês`,
      color: '#C9A96E',
    },
    {
      icon: Clock,
      label: 'Próximas',
      value: stats.upcoming ?? 0,
      sub: 'consultas agendadas',
      color: '#9B8DC8',
    },
    {
      icon: TrendingUp,
      label: 'Receita Estimada',
      value: `€${stats.estimatedRevenue ?? 0}`,
      sub: 'das marcações confirmadas',
      color: '#4A9E6A',
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map(c => (
        <div key={c.label} className={styles.card}>
          <div className={styles.iconWrap} style={{ background: c.color + '18', color: c.color }}>
            <c.icon size={20} aria-hidden="true" />
          </div>
          <div className={styles.body}>
            <p className={styles.label}>{c.label}</p>
            <p className={styles.value}>{c.value}</p>
            <p className={styles.sub}>{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
