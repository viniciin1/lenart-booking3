import { Clock, Check, Plus, Minus, AlertTriangle } from 'lucide-react'
import { SERVICES, EXTRAS, formatDuration } from '../../lib/services'
import styles from './Step1Service.module.css'

const BROKEN_NAIL_WARN_THRESHOLD = 4

export default function Step1Service({ selected, extras = [], onSelect, onExtrasChange, onContinue }) {
  const getExtra = (id) => extras.find(e => e.id === id)

  const brokenNailQty = getExtra('broken-nail')?.qty ?? 0
  const showBrokenNailWarning = brokenNailQty >= BROKEN_NAIL_WARN_THRESHOLD

  const handleExtraToggle = (extra) => {
    const existing = getExtra(extra.id)
    if (existing) {
      onExtrasChange(extras.filter(e => e.id !== extra.id))
    } else {
      onExtrasChange([...extras, { id: extra.id, name: extra.name, price: extra.price, qty: 1 }])
    }
  }

  const handleQty = (extraId, delta) => {
    onExtrasChange(
      extras.map(e => {
        if (e.id !== extraId) return e
        const newQty = Math.max(1, e.qty + delta)
        return { ...e, qty: newQty }
      })
    )
  }

  return (
    <div className={styles.root}>
      {/* ── Service selection ── */}
      <div className={styles.heading}>
        <h2 className={styles.title}>Escolha o seu serviço</h2>
        <p className={styles.sub}>Selecione o tratamento que pretende marcar.</p>
      </div>

      <div className={styles.grid}>
        {SERVICES.map(svc => {
          const isSelected = selected?.id === svc.id
          return (
            <button
              key={svc.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => onSelect(svc)}
              aria-pressed={isSelected}
              aria-label={`Selecionar ${svc.name}`}
              type="button"
            >
              <div className={styles.strip} style={{ background: svc.gradient }} />
              {isSelected && (
                <span className={styles.tick} aria-hidden="true">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
              <div className={styles.body}>
                <span className={styles.tagline} style={{ color: svc.accentColor }}>
                  {svc.tagline}
                </span>
                <h3 className={styles.name}>{svc.name}</h3>
                <div className={styles.foot}>
                  <span className={styles.duration}>
                    <Clock size={12} aria-hidden="true" />
                    {formatDuration(svc.duration)}
                  </span>
                  <span className={styles.price}>
                    {svc.priceNote ?? `€${svc.price}`}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Extras – only shown when a service is selected ── */}
      {selected && (
        <div className={styles.extrasSection}>
          <div className={styles.extrasDivider} aria-hidden="true" />
          <h3 className={styles.extrasTitle}>Adicionais</h3>
          <p className={styles.extrasSub}>Quer adicionar algum serviço extra?</p>

          <div className={styles.extrasList}>
            {EXTRAS.map(extra => {
              const selectedExtra = getExtra(extra.id)
              return (
                <div
                  key={extra.id}
                  className={`
                    ${styles.extraCard}
                    ${selectedExtra ? styles.extraCardSelected : ''}
                    ${extra.free ? styles.extraCardFree : ''}
                  `}
                >
                  <button
                    type="button"
                    className={styles.extraToggle}
                    onClick={() => handleExtraToggle(extra)}
                    aria-pressed={!!selectedExtra}
                    aria-label={`${selectedExtra ? 'Remover' : 'Adicionar'} ${extra.name}`}
                  >
                    <span className={styles.extraIcon}>{extra.icon}</span>
                    <div className={styles.extraInfo}>
                      <span className={styles.extraName}>{extra.name}</span>
                      <span className={styles.extraDesc}>{extra.description}</span>
                    </div>
                    <span className={`${styles.extraPrice} ${extra.free ? styles.extraPriceFree : ''} ${extra.noQty && !extra.free ? styles.extraPriceConsulta : ''}`}>
                      {extra.priceLabel}
                    </span>
                    <span className={`${styles.extraCheckbox} ${selectedExtra ? styles.extraCheckboxOn : ''}`} aria-hidden="true">
                      {selectedExtra ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
                    </span>
                  </button>

                  {/* Quantity selector — hidden for noQty extras */}
                  {selectedExtra && !extra.noQty && (
                    <div className={styles.qtyRow}>
                      <span className={styles.qtyLabel}>Quantidade:</span>
                      <div className={styles.qtyControls}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQty(extra.id, -1)}
                          aria-label="Diminuir quantidade"
                          disabled={selectedExtra.qty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{selectedExtra.qty}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQty(extra.id, +1)}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className={styles.qtyTotal}>
                        = €{(extra.price * selectedExtra.qty).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}

                  {/* Warning: 4+ broken nails = charged as new application */}
                  {extra.id === 'broken-nail' && showBrokenNailWarning && (
                    <div className={styles.brokenNailWarning} role="alert">
                      <AlertTriangle size={15} className={styles.warnIcon} aria-hidden="true" />
                      <p>
                        Com <strong>4 ou mais unhas</strong> a necessitar de reparação ou reconstrução,
                        o serviço será cobrado como <strong>nova aplicação</strong>.
                        A nossa equipa irá confirmar o valor final no dia da consulta.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Continue button */}
          <div className={styles.continueRow}>
            <button
              type="button"
              className="btn-primary"
              onClick={onContinue}
            >
              Continuar
              {extras.length > 0 && (
                <span className={styles.extrasBadge}>
                  +{extras.length} extra{extras.length > 1 ? 's' : ''}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
