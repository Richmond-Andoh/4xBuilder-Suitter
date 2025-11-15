'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User, AuthState } from '@/lib/types'
import { mockUsers } from '@/lib/mock-data'

interface AuthContextType {
  state: AuthState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  currentUser: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isConnected: false,
    address: null,
    user: null,
  })

  useEffect(() => {
    // Check for stored wallet connection
    const stored = localStorage.getItem('suitter_wallet')
    if (stored) {
      const { address, user } = JSON.parse(stored)
      
      // Verify wallet is still connected
      if (typeof window !== 'undefined' && (window as any).slushWallet) {
        ;(async () => {
          try {
            const accounts = await (window as any).slushWallet.getAccounts()
            if (accounts && accounts.includes(address)) {
              setState({ isConnected: true, address, user })
            } else {
              // Wallet disconnected, clear stored data
              localStorage.removeItem('suitter_wallet')
            }
          } catch (error) {
            console.error('Failed to verify wallet connection:', error)
            localStorage.removeItem('suitter_wallet')
          }
        })()
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      // Check if Slush wallet is available
      if (typeof window !== 'undefined' && (window as any).slushWallet) {
        const slushWallet = (window as any).slushWallet
        
        // Request connection
        const accounts = await slushWallet.connect()
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0]
          
          // Get account info from Slush wallet
          const accountInfo = await slushWallet.getAccount()
          
          // Create user profile from wallet data
          const mockUser = {
            ...mockUsers[0],
            id: address.slice(0, 10),
            username: `user_${address.slice(2, 8)}`,
            displayName: accountInfo?.name || `User ${address.slice(2, 8)}`,
            avatar: accountInfo?.avatar || mockUsers[0].avatar,
          }
          
          const newState = {
            isConnected: true,
            address: address,
            user: mockUser,
          }
          
          setState(newState)
          localStorage.setItem('suitter_wallet', JSON.stringify(newState))
        }
      } else {
        throw new Error('Slush wallet not found. Please install the extension.')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }, [])

  const disconnectWallet = useCallback(() => {
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
