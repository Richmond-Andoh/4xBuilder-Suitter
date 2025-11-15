import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SessionKeyProvider } from './context/SessionKeyProvider'
import { MessagingClientProvider } from './context/MessagingClientProvider'
import { networkConfig } from './networkConfig'
import "@mysten/dapp-kit/dist/index.css"
import './index.css'

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect={false}>
            <SessionKeyProvider>
              <MessagingClientProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </MessagingClientProvider>
            </SessionKeyProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

