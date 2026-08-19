# LENART Booking System – Setup Guide

## Prerequisites

- **Node.js 20+** – https://nodejs.org/en/download
- npm (comes with Node)

---

## 1. Install dependencies

Open a terminal in `lenart-booking/` and run:

```bash
npm run install:all
```

This installs packages for both `frontend/` and `backend/`.

---

## 2. Configure the backend

Copy the example env file and fill in your values:

```bash
# Windows PowerShell
Copy-Item backend/.env.example backend/.env
```

Key values to set in `backend/.env`:

| Variable | Description |
|---|---|
| `ADMIN_PASSWORD` | Password you use to log into `/admin` |
| `JWT_SECRET` | Any long random string |
| `STRIPE_SECRET_KEY` | From your Stripe dashboard (use `sk_test_...` for dev) |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` CLI (dev) or Stripe dashboard (prod) |
| `FRONTEND_URL` | `http://localhost:5173` for dev |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail address + App Password for confirmation emails |

---

## 3. Run in development

Open **two terminals**:

**Terminal 1 – Backend:**
```bash
cd lenart-booking/backend
npm run dev
# API running at http://localhost:3001
```

**Terminal 2 – Frontend:**
```bash
cd lenart-booking/frontend
npm run dev
# App running at http://localhost:5173
```

---

## 4. Test the deposit flow (without Stripe)

In development, use the simulate endpoint to confirm a booking without real payment:

```
POST http://localhost:3001/api/payments/simulate-paid/<bookingId>
```

Or run the Stripe CLI:
```bash
stripe listen --forward-to localhost:3001/api/payments/webhook
```

---

## 5. Admin dashboard

Navigate to: `http://localhost:5173/admin/login`

Default password: `lenart2024` (set in `backend/.env` → `ADMIN_PASSWORD`)

---

## 6. Production deployment

1. Build the frontend: `npm run build` (outputs to `frontend/dist/`)
2. Serve `frontend/dist/` via a static host (Vercel, Netlify, Cloudflare Pages) or Express static middleware
3. Deploy the backend to Railway, Render, or any Node host
4. Set `FRONTEND_URL` in production `.env` to your real domain
5. Configure Stripe webhook endpoint in the Stripe dashboard: `https://yourdomain.com/api/payments/webhook`
6. Replace the in-memory store (`backend/src/data/store.js`) with a real database for persistence

---

## Project structure

```
lenart-booking/
├── frontend/               React + Vite app
│   └── src/
│       ├── components/     Header, Footer, Policies, Services, booking/*, admin/*
│       ├── hooks/          useBooking
│       ├── lib/            api.js, services.js
│       └── pages/          HomePage, BookingPage, AdminPage, AdminLoginPage
└── backend/                Express API
    └── src/
        ├── data/           store.js (in-memory DB), services.js
        ├── lib/            availability.js, mailer.js, auth.js
        └── routes/         availability, bookings, payments, admin
```
