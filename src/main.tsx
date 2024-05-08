import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from '@/Router'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
