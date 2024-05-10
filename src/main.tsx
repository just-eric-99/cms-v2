import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from '@/Router'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
