import { Check } from 'lucide-react'
import styles from './StepIndicator.module.css'

const STEPS = [
  { n: 1, label: 'Serviço'    },
  { n: 2, label: 'Data e Hora' },
  { n: 3, label: 'Dados'      },
  { n: 4, label: 'Sinal'      },
  { n: 5, label: 'Confirmado' },
]

export default function StepIndicator({ current }) {
  return (
    <nav className={styles.root} aria-label="Passos da marcação">
      {STEPS.map((s, i) => {
        const done   = current > s.n
        const active = current === s.n
        return (
          <div key={s.n} className={styles.item}>
            <div className={`${styles.circle} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
                 aria-current={active ? 'step' : undefined}>
              {done ? <Check size={13} strokeWidth={3} /> : s.n}
            </div>
            <span className={`${styles.label} ${active ? styles.labelActive : ''}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`${styles.line} ${done ? styles.lineDone : ''}`} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
