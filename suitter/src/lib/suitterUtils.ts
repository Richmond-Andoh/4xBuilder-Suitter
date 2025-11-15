// Utility functions for Suitter smart contract operations
// These are standalone functions that don't use React hooks
// Can be used in contexts, utils, or components that need non-hook versions

import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { getSuiClient } from '@/hooks/useSui'
import { queryProfileByOwner, type OnChainProfile } from '@/lib/suitterQueries'
import { User } from '@/lib/types'

/**
 * Convert on-chain Profile to app User type
 */
function onChainProfileToUser(profile: OnChainProfile, address: string): User {
  return {
    id: profile.id,
    address: profile.owner,
    username: profile.username,
    displayName: profile.username, // Use username as display name if not available
    bio: profile.bio,
    avatar: profile.image_url || '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    joinedAt: new Date(), // Timestamp not stored in contract
    followersCount: 0, // Not tracked in contract
    followingCount: 0, // Not tracked in contract
  }
}

/**
 * Get user profile from blockchain by address
 * Standalone version without React hooks
 */
export async function getProfileByAddress(address: string): Promise<User | null> {
  try {
    const client = getSuiClient()
    const profile = await queryProfileByOwner(client, address)
    
    if (!profile) {
      return null
    }

    return onChainProfileToUser(profile, address)
  } catch (error) {
    console.error('Error getting profile:', error)
    return null
  }
}

/**
 * Check if a profile exists for an address
 */
export async function profileExists(address: string): Promise<boolean> {
  try {
    const profile = await getProfileByAddress(address)
    return profile !== null
  } catch (error) {
    console.error('Error checking profile existence:', error)
    return false
  }
}

