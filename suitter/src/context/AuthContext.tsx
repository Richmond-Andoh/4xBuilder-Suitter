import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User, AuthState } from '@/lib/types'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'

interface AuthContextType {
  state: AuthState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  currentUser: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Declare Slush wallet types
declare global {
  interface Window {
    slushWallet?: {
      connect: () => Promise<string[]>
      disconnect: () => Promise<void>
      getAccounts: () => Promise<string[]>
      getAccount: () => Promise<{ address: string; name?: string; avatar?: string } | null>
      signAndExecuteTransaction: (transaction: any) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isConnected: false,
    address: null,
    user: null,
  })

  // Auto-reconnect on page load
  useEffect(() => {
    const stored = localStorage.getItem('suitter_wallet')
    if (stored) {
      try {
        const { address } = JSON.parse(stored)
        
        // Check if Slush wallet is available and still connected
        if (typeof window !== 'undefined' && window.slushWallet) {
          (async () => {
            try {
              const accounts = await window.slushWallet!.getAccounts()
              if (accounts && accounts.includes(address)) {
                // Verify connection and restore state
                const account = await window.slushWallet!.getAccount()
                const user: User = {
                  id: address.slice(0, 10),
                  address,
                  username: `user_${address.slice(2, 8)}`,
                  displayName: account?.name || `User ${address.slice(2, 8)}`,
                  bio: '',
                  avatar: account?.avatar || '/placeholder-user.jpg',
                  banner: '/placeholder.jpg',
                  joinedAt: new Date(),
                  followersCount: 0,
                  followingCount: 0,
                }
                setState({ isConnected: true, address, user })
              } else {
                localStorage.removeItem('suitter_wallet')
              }
            } catch (error) {
              console.error('Failed to verify wallet connection:', error)
              localStorage.removeItem('suitter_wallet')
            }
          })()
        } else {
          // Slush not available, clear stored data
          localStorage.removeItem('suitter_wallet')
        }
      } catch (error) {
        console.error('Failed to parse stored wallet data:', error)
        localStorage.removeItem('suitter_wallet')
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      // Check if Slush wallet is available
      if (typeof window === 'undefined' || !window.slushWallet) {
        throw new Error('Slush wallet not found. Please install the Slush extension.')
      }

      // Request connection - this should trigger the extension approval UI
      const accounts = await window.slushWallet.connect()
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      const address = accounts[0]
      
      // Get account info from Slush wallet
      const account = await window.slushWallet.getAccount()
      
      // Create or get user profile
      const user: User = {
        id: address.slice(0, 10),
        address,
        username: `user_${address.slice(2, 8)}`,
        displayName: account?.name || `User ${address.slice(2, 8)}`,
        bio: '',
        avatar: account?.avatar || '/placeholder-user.jpg',
        banner: '/placeholder.jpg',
        joinedAt: new Date(),
        followersCount: 0,
        followingCount: 0,
      }

      // Check if profile exists on-chain, if not create it
      // TODO: Check if profile exists, create if not
      // This will be implemented in useSui hook
      // For now, we'll skip the on-chain check to avoid circular dependency
      
      const newState = {
        isConnected: true,
        address,
        user,
      }
      
      setState(newState)
      localStorage.setItem('suitter_wallet', JSON.stringify(newState))
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    try {
      if (window.slushWallet) {
        await window.slushWallet.disconnect()
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
    
    setState({ isConnected: false, address: null, user: null })
    localStorage.removeItem('suitter_wallet')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state,
        connectWallet,
        disconnectWallet,
        currentUser: state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

