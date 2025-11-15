import { useCallback } from 'react'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useAuth } from '@/context/AuthContext'
import { User, Post, Reply } from '@/lib/types'

// Sui network configuration
const SUI_NETWORK = 'testnet' // Change to 'mainnet' for production
const FULLNODE_URL = getFullnodeUrl(SUI_NETWORK)

// Contract addresses (these should be set from environment variables in production)
const PROFILE_PACKAGE_ID = import.meta.env.VITE_PROFILE_PACKAGE_ID || '0x0'
const POST_PACKAGE_ID = import.meta.env.VITE_POST_PACKAGE_ID || '0x0'

let suiClient: SuiClient | null = null

export function getSuiClient(): SuiClient {
  if (!suiClient) {
    suiClient = new SuiClient({ url: FULLNODE_URL })
  }
  return suiClient
}

export function useSui() {
  const { state } = useAuth()

  // Profile operations
  const createProfile = useCallback(async (displayName: string, bio: string, avatar?: string, banner?: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    // tx.moveCall({
    //   target: `${PROFILE_PACKAGE_ID}::profile::create`,
    //   arguments: [displayName, bio, avatar || '', banner || ''],
    // })

    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const updateProfile = useCallback(async (displayName?: string, bio?: string, avatar?: string, banner?: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const getProfile = useCallback(async (address: string): Promise<User | null> => {
    const client = getSuiClient()
    
    // TODO: Query on-chain profile data
    // For now, return null (will be handled by mock data)
    return null
  }, [])

  // Post operations
  const createPost = useCallback(async (content: string, images: string[] = []): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    if (content.length > 280) {
      throw new Error('Post content exceeds 280 characters')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const deletePost = useCallback(async (postId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const getPosts = useCallback(async (limit = 20, offset = 0): Promise<Post[]> => {
    const client = getSuiClient()
    
    // TODO: Query on-chain posts
    // For now, return empty array (will be handled by mock data)
    return []
  }, [])

  const getPostById = useCallback(async (postId: string): Promise<Post | null> => {
    const client = getSuiClient()
    
    // TODO: Query on-chain post
    return null
  }, [])

  // Interaction operations
  const likePost = useCallback(async (postId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const unlikePost = useCallback(async (postId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const resharePost = useCallback(async (postId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const commentOnPost = useCallback(async (postId: string, content: string, images: string[] = []): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  // Follow operations
  const followUser = useCallback(async (userId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const unfollowUser = useCallback(async (userId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  const getFollowers = useCallback(async (userId: string, limit = 20, offset = 0): Promise<User[]> => {
    const client = getSuiClient()
    
    // TODO: Query on-chain followers
    return []
  }, [])

  const getFollowing = useCallback(async (userId: string, limit = 20, offset = 0): Promise<User[]> => {
    const client = getSuiClient()
    
    // TODO: Query on-chain following
    return []
  }, [])

  // Notification operations
  const getNotifications = useCallback(async (limit = 20, offset = 0) => {
    const client = getSuiClient()
    
    // TODO: Query on-chain notifications
    return []
  }, [])

  const markNotificationRead = useCallback(async (notificationId: string): Promise<string> => {
    if (!state.address || !window.slushWallet) {
      throw new Error('Wallet not connected')
    }

    const tx = new Transaction()
    
    // TODO: Implement actual contract call
    const result = await window.slushWallet.signAndExecuteTransaction({
      transactionBlock: tx,
    })

    return result.digest
  }, [state.address])

  // Estimate gas for a transaction
  const estimateGas = useCallback(async (tx: Transaction): Promise<bigint> => {
    const client = getSuiClient()
    if (!state.address) {
      throw new Error('Wallet not connected')
    }

    // TODO: Implement gas estimation
    return BigInt(1000) // Placeholder
  }, [state.address])

  return {
    // Profile
    createProfile,
    updateProfile,
    getProfile,
    // Posts
    createPost,
    deletePost,
    getPosts,
    getPostById,
    // Interactions
    likePost,
    unlikePost,
    resharePost,
    commentOnPost,
    // Follow
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    // Notifications
    getNotifications,
    markNotificationRead,
    // Utilities
    estimateGas,
    getSuiClient,
  }
}

