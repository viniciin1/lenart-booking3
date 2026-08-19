import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.85rem',
            borderRadius: '12px',
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 20px rgba(224,159,156,0.18)',
          },
          success: { iconTheme: { primary: '#E09F9C', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
