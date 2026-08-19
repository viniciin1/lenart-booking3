import { Router } from 'express'
import Stripe from 'stripe'
import { getBookingById, updateBooking } from '../data/store.js'
import { sendConfirmationEmail } from '../lib/mailer.js'

const router = Router()

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured.')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
}

/**
 * POST /api/payments/checkout
 * Creates a Stripe Checkout session for the €10 deposit.
 */
router.post('/checkout', async (req, res) => {
  const { bookingId } = req.body

  if (!bookingId) {
    return res.status(400).json({ message: 'bookingId is required.' })
  }

  const booking = getBookingById(bookingId)
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }
  if (booking.depositPaid) {
    return res.status(409).json({ message: 'Deposit already paid.' })
  }

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'mb_way'],
      line_items: [
        {
          price_data: {
            currency:     'eur',
            product_data: {
              name:        `Deposit – ${booking.serviceName}`,
              description: `${booking.date} at ${booking.time} · Ref: ${booking.confirmationCode}`,
            },
            unit_amount:  1000, // €10.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking?confirmed=${booking.confirmationCode}`,
      cancel_url:  `${process.env.FRONTEND_URL}/booking`,
      metadata: {
        bookingId:        booking.id,
        confirmationCode: booking.confirmationCode,
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('[payments] Stripe error:', err.message)
    res.status(500).json({ message: 'Failed to create checkout session.' })
  }
})

/**
 * POST /api/payments/webhook
 * Stripe webhook – marks deposit as paid and confirms the booking.
 */
router.post('/webhook', async (req, res) => {
  const sig    = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    const stripe = getStripe()
    event = secret
      ? stripe.webhooks.constructEvent(req.body, sig, secret)
      : JSON.parse(req.body.toString())
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      const updated = updateBooking(bookingId, {
        status:      'confirmed',
        depositPaid: true,
      })

      if (updated) {
        try {
          await sendConfirmationEmail(updated)
        } catch (mailErr) {
          console.error('[webhook] Email send failed:', mailErr.message)
        }
      }
    }
  }

  res.json({ received: true })
})

/**
 * POST /api/payments/simulate-paid/:bookingId
 * Dev-only endpoint to mark a booking as paid without Stripe.
 */
router.post('/simulate-paid/:bookingId', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production.' })
  }

  const booking = getBookingById(req.params.bookingId)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })

  const updated = updateBooking(booking.id, { status: 'confirmed', depositPaid: true })

  try {
    await sendConfirmationEmail(updated)
  } catch { /* ignore in dev */ }

  res.json({ ...updated, _note: 'Simulated payment — dev only' })
})

export default router
