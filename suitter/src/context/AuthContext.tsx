import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User, AuthState } from '@/lib/types'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { useCurrentWallet, useCurrentAccount } from '@mysten/dapp-kit'

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
  // Sync with dapp-kit wallet state
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const account = useCurrentAccount()

  const [state, setState] = useState<AuthState>({
    isConnected: false,
    address: null,
    user: null,
  })

  // Sync AuthContext state with dapp-kit wallet state
  useEffect(() => {
    // Check if wallet is connected via account (more reliable)
    const isWalletConnected = account !== null && connectionStatus === 'connected'
    
    if (isWalletConnected && account) {
      const address = account.address
      const label = account.label || account.address.slice(0, 6)
      
      // Only update if address has changed
      setState((prevState) => {
        if (prevState.address === address && prevState.isConnected) {
          return prevState // No change needed
        }
        
        // Create user object
        const user: User = {
          id: address.slice(0, 10),
          address,
          username: `${label}.sui`,
          displayName: label,
          bio: '',
          avatar: '/placeholder-user.jpg',
          banner: '/placeholder.jpg',
          joinedAt: new Date(),
          followersCount: 0,
          followingCount: 0,
        }

        const newState: AuthState = {
          isConnected: true,
          address,
          user,
        }

        localStorage.setItem('suitter_wallet', JSON.stringify(newState))
        return newState
      })
    } else if (connectionStatus === 'disconnected' || (!account && connectionStatus !== 'connecting')) {
      // Only clear state if wallet is explicitly disconnected
      // Don't clear if it's still connecting
      setState({
        isConnected: false,
        address: null,
        user: null,
      })
    }
  }, [account, connectionStatus])

  // Load from localStorage on mount (fallback while dapp-kit initializes)
  useEffect(() => {
    const stored = localStorage.getItem('suitter_wallet')
    if (stored && (!currentWallet || connectionStatus !== 'connected')) {
      try {
        const storedState = JSON.parse(stored)
        // Only restore if dapp-kit wallet is not connected yet
        // This helps with initial page load before dapp-kit initializes
        if (storedState.address && storedState.user && !state.isConnected) {
          setState(storedState)
        }
      } catch (error) {
        console.error('Failed to parse stored wallet data:', error)
        // Don't remove localStorage here - let it be updated by the main useEffect
      }
    }
  }, []) // Only run once on mount

  const connectWallet = useCallback(async () => {
    // Wallet connection is now handled by @mysten/dapp-kit
    // This function is kept for backwards compatibility but should redirect to wallet modal
    // The actual connection happens via WalletModal which uses useConnectWallet
    if (!currentWallet) {
      throw new Error('Please use the Connect Wallet button in the header to connect your wallet')
    }
    // If wallet is already connected, do nothing
    return
  }, [currentWallet])

  const disconnectWallet = useCallback(async () => {
    // Wallet disconnection is handled by @mysten/dapp-kit
    // The state will automatically update via the useEffect hook
    // when currentWallet becomes null
    if (currentWallet) {
      // If you want to programmatically disconnect, use:
      // currentWallet.disconnect()
      // But usually the ConnectButton handles this
    }
    setState({ isConnected: false, address: null, user: null })
    localStorage.removeItem('suitter_wallet')
  }, [currentWallet])

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

