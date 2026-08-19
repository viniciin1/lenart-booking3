import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/booking"   element={<BookingPage />} />
      <Route path="/admin"     element={<AdminPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
    </Routes>
  )
}
