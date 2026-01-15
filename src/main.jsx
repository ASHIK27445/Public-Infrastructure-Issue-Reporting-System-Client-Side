import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './Routes/Routes.jsx'
import AuthProvider from './Pages/AuthProvider/AuthProvider.jsx'
import { ThemeProvider } from './Pages/Theme/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </AuthProvider>
    </ThemeProvider>

  </StrictMode>,
)
