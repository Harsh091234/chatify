import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> */}

       <BrowserRouter>
    <Toaster 
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#333',
      color: '#fff',
    },
  }}
/>  <App />

    </BrowserRouter>
     {/* </GoogleOAuthProvider> */}
   
    </StrictMode>,
)
