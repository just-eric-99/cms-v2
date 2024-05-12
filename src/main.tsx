import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from '@/Router'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'jotai'
import { store } from './state/global'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <Router />
          <Toaster />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
