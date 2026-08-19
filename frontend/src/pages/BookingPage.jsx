import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StepIndicator from '../components/booking/StepIndicator'
import Step1Service from '../components/booking/Step1Service'
import Step2DateTime from '../components/booking/Step2DateTime'
import Step3Details from '../components/booking/Step3Details'
import Step4Payment from '../components/booking/Step4Payment'
import Step5Confirmation from '../components/booking/Step5Confirmation'
import { useBooking } from '../hooks/useBooking'
import { getServiceById } from '../lib/services'
import { getBookingByCode } from '../lib/api'
import styles from './BookingPage.module.css'

export default function BookingPage() {
  const {
    state,
    selectService,
    setExtras,
    selectDateTime,
    setClient,
    setStep,
    setConfirmation,
    goBack,
  } = useBooking()

  const [searchParams]      = useSearchParams()
  const [stripeLoading, setStripeLoading] = useState(false)

  useEffect(() => {
    const serviceId = searchParams.get('service')
    const confirmed = searchParams.get('confirmed')

    if (confirmed) {
      setStripeLoading(true)
      getBookingByCode(confirmed)
        .then(booking => {
          const svc = getServiceById(booking.serviceId)
          if (svc) selectService(svc)
          selectDateTime(booking.date, booking.time)
          setClient({
            name:  booking.clientName,
            phone: booking.clientPhone,
            email: booking.clientEmail,
            notes: booking.notes ?? '',
          })
          setConfirmation(null, booking.confirmationCode)
        })
        .catch(() => setStep(1))
        .finally(() => setStripeLoading(false))
      return
    }

    if (serviceId && !state.service) {
      const svc = getServiceById(serviceId)
      if (svc) selectService(svc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDetailsSubmit = (clientData) => {
    setClient(clientData)
    setStep(4)
  }

  if (stripeLoading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingCenter}>
            <Loader2 size={32} className={styles.spinner} aria-label="A carregar confirmação…" />
            <p>A carregar a sua confirmação…</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.inner}>

            {state.step > 1 && state.step < 5 && (
              <button
                type="button"
                onClick={goBack}
                className={styles.backBtn}
                aria-label="Voltar ao passo anterior"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Voltar
              </button>
            )}

            {state.step < 5 && (
              <StepIndicator current={state.step} />
            )}

            <div className={styles.stepContent}>
              {state.step === 1 && (
                <Step1Service
                  selected={state.service}
                  extras={state.extras}
                  onSelect={svc => {
                    // Select service but stay on step 1 to show extras
                    selectService(svc)
                    setStep(1)
                  }}
                  onExtrasChange={setExtras}
                  onContinue={() => setStep(2)}
                />
              )}
              {state.step === 2 && (
                <Step2DateTime service={state.service} onSelect={selectDateTime} />
              )}
              {state.step === 3 && (
                <Step3Details
                  service={state.service}
                  date={state.date}
                  time={state.time}
                  initial={state.client}
                  onSubmit={handleDetailsSubmit}
                />
              )}
              {state.step === 4 && (
                <Step4Payment state={state} onConfirm={setConfirmation} />
              )}
              {state.step === 5 && (
                <Step5Confirmation state={state} />
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
