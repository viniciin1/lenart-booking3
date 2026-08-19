import nodemailer from 'nodemailer'
import { format, parseISO } from 'date-fns'

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   ?? 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendConfirmationEmail(booking) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[mailer] Email credentials not configured – skipping confirmation email.')
    return
  }

  const transporter = createTransport()
  const dateStr = format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')

  const html = `
    <div style="font-family:'Montserrat',sans-serif;max-width:540px;margin:0 auto;color:#333">
      <div style="background:#FAF7F5;padding:32px;text-align:center;border-bottom:3px solid #E09F9C">
        <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:4px;margin:0">LENART</h1>
        <p style="font-size:12px;color:#E09F9C;margin:4px 0 0;letter-spacing:2px">NAIL ARTIST</p>
      </div>

      <div style="padding:32px 28px">
        <h2 style="font-family:Georgia,serif;font-weight:400;font-size:22px;margin:0 0 8px">
          Booking Confirmed ✓
        </h2>
        <p style="color:#888;font-size:14px;margin:0 0 28px">
          Hi ${booking.clientName}, your appointment is confirmed!
        </p>

        <div style="background:#fff;border:1px solid #EDE8E5;border-radius:12px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;color:#888;width:130px">Confirmation</td>
              <td style="padding:8px 0;font-weight:600">#${booking.confirmationCode}</td>
            </tr>
            <tr style="border-top:1px solid #EDE8E5">
              <td style="padding:8px 0;color:#888">Service</td>
              <td style="padding:8px 0;font-weight:600">${booking.serviceName}</td>
            </tr>
            <tr style="border-top:1px solid #EDE8E5">
              <td style="padding:8px 0;color:#888">Date</td>
              <td style="padding:8px 0">${dateStr}</td>
            </tr>
            <tr style="border-top:1px solid #EDE8E5">
              <td style="padding:8px 0;color:#888">Time</td>
              <td style="padding:8px 0">${booking.time}</td>
            </tr>
            <tr style="border-top:1px solid #EDE8E5">
              <td style="padding:8px 0;color:#888">Deposit paid</td>
              <td style="padding:8px 0;color:#2D9F6F;font-weight:600">€10.00</td>
            </tr>
            <tr style="border-top:1px solid #EDE8E5">
              <td style="padding:8px 0;color:#888">Balance due</td>
              <td style="padding:8px 0">€${(booking.servicePrice ?? 0) - 10} on the day</td>
            </tr>
          </table>
        </div>

        <div style="background:#FBF0EF;border:1px solid #F2D4D3;border-radius:10px;padding:16px;margin-bottom:24px;font-size:13px;color:#888">
          <strong style="color:#C8827F">Reminders</strong><br/>
          • Please arrive on time. Grace period is 15 minutes.<br/>
          • Cancellations must be made at least 24 hours in advance.<br/>
          • The deposit is non-refundable for no-shows or last-minute cancellations.
        </div>

        <p style="font-size:13px;color:#888">
          Questions? Message me on 
          <a href="https://wa.me/${process.env.WHATSAPP_NUMBER ?? '351910000000'}" style="color:#E09F9C">WhatsApp</a>.
        </p>
      </div>

      <div style="padding:20px 28px;text-align:center;border-top:1px solid #EDE8E5">
        <p style="font-family:'Parisienne',cursive,serif;font-size:20px;color:#E09F9C;margin:0">
          Thank you for booking with me. ♥
        </p>
        <p style="font-size:11px;color:#bbb;margin:8px 0 0">
          © ${new Date().getFullYear()} LENART Nail Artist
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
    to:      booking.clientEmail,
    subject: `Booking Confirmed – ${booking.serviceName} on ${dateStr} · LENART`,
    html,
  })
}
