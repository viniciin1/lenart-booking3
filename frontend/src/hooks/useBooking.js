import { useState, useCallback } from 'react'

const INITIAL = {
  step: 1,
  service: null,    // service object
  extras: [],       // [{ id, name, price, qty }]
  date: null,
  time: null,
  client: { name: '', phone: '', email: '', notes: '' },
  bookingId: null,
  confirmationCode: null,
}

export function useBooking() {
  const [state, setState] = useState(INITIAL)

  const setStep = useCallback(step => setState(s => ({ ...s, step })), [])

  // Selects service and advances to step 2
  const selectService = useCallback(service => {
    setState(s => ({ ...s, service, step: 2 }))
  }, [])

  // Updates extras without advancing step
  const setExtras = useCallback(extras => {
    setState(s => ({ ...s, extras }))
  }, [])

  const selectDateTime = useCallback((date, time) => {
    setState(s => ({ ...s, date, time, step: 3 }))
  }, [])

  const setClient = useCallback(client => {
    setState(s => ({ ...s, client }))
  }, [])

  const setConfirmation = useCallback((bookingId, confirmationCode) => {
    setState(s => ({ ...s, bookingId, confirmationCode, step: 5 }))
  }, [])

  const reset = useCallback(() => setState(INITIAL), [])

  const goBack = useCallback(() => {
    setState(s => ({ ...s, step: Math.max(1, s.step - 1) }))
  }, [])

  return { state, setStep, selectService, setExtras, selectDateTime, setClient, setConfirmation, reset, goBack }
}
