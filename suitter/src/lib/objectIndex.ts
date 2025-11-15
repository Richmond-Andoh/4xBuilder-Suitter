// Utility for tracking on-chain object IDs
// In production, you'd use a database or indexer service

const STORAGE_KEYS = {
  SUIT_IDS: 'suitter_suit_ids',
  LIKE_IDS: 'suitter_like_ids',
  COMMENT_IDS: 'suitter_comment_ids',
  SUIT_IDS_BY_AUTHOR: 'suitter_suit_ids_by_author',
  LIKE_IDS_BY_SUIT: 'suitter_like_ids_by_suit',
  COMMENT_IDS_BY_SUIT: 'suitter_comment_ids_by_suit',
} as const

/**
 * Get all Suit IDs from local storage
 */
export function getSuitIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUIT_IDS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a Suit ID to the index
 */
export function addSuitId(suitId: string, authorAddress: string): void {
  try {
    // Add to global list
    const allIds = getSuitIds()
    if (!allIds.includes(suitId)) {
      allIds.push(suitId)
      localStorage.setItem(STORAGE_KEYS.SUIT_IDS, JSON.stringify(allIds))
    }

    // Add to author-specific list
    const authorKey = `${STORAGE_KEYS.SUIT_IDS_BY_AUTHOR}_${authorAddress}`
    const authorIds = getAuthorSuitIds(authorAddress)
    if (!authorIds.includes(suitId)) {
      authorIds.push(suitId)
      localStorage.setItem(authorKey, JSON.stringify(authorIds))
    }
  } catch (error) {
    console.error('Error adding suit ID:', error)
  }
}

/**
 * Get Suit IDs for a specific author
 */
export function getAuthorSuitIds(authorAddress: string): string[] {
  try {
    const authorKey = `${STORAGE_KEYS.SUIT_IDS_BY_AUTHOR}_${authorAddress}`
    const stored = localStorage.getItem(authorKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a Like ID to the index
 */
export function addLikeId(likeId: string, suitId: string): void {
  try {
    // Add to global list
    const allIds = getLikeIds()
    if (!allIds.includes(likeId)) {
      allIds.push(likeId)
      localStorage.setItem(STORAGE_KEYS.LIKE_IDS, JSON.stringify(allIds))
    }

    // Add to suit-specific list
    const suitKey = `${STORAGE_KEYS.LIKE_IDS_BY_SUIT}_${suitId}`
    const suitLikes = getSuitLikeIds(suitId)
    if (!suitLikes.includes(likeId)) {
      suitLikes.push(likeId)
      localStorage.setItem(suitKey, JSON.stringify(suitLikes))
    }
  } catch (error) {
    console.error('Error adding like ID:', error)
  }
}

/**
 * Get Like IDs for a specific Suit
 */
export function getSuitLikeIds(suitId: string): string[] {
  try {
    const suitKey = `${STORAGE_KEYS.LIKE_IDS_BY_SUIT}_${suitId}`
    const stored = localStorage.getItem(suitKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Get all Like IDs
 */
export function getLikeIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LIKE_IDS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a Comment ID to the index
 */
export function addCommentId(commentId: string, suitId: string): void {
  try {
    // Add to global list
    const allIds = getCommentIds()
    if (!allIds.includes(commentId)) {
      allIds.push(commentId)
      localStorage.setItem(STORAGE_KEYS.COMMENT_IDS, JSON.stringify(allIds))
    }

    // Add to suit-specific list
    const suitKey = `${STORAGE_KEYS.COMMENT_IDS_BY_SUIT}_${suitId}`
    const suitComments = getSuitCommentIds(suitId)
    if (!suitComments.includes(commentId)) {
      suitComments.push(commentId)
      localStorage.setItem(suitKey, JSON.stringify(suitComments))
    }
  } catch (error) {
    console.error('Error adding comment ID:', error)
  }
}

/**
 * Get Comment IDs for a specific Suit
 */
export function getSuitCommentIds(suitId: string): string[] {
  try {
    const suitKey = `${STORAGE_KEYS.COMMENT_IDS_BY_SUIT}_${suitId}`
    const stored = localStorage.getItem(suitKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Get all Comment IDs
 */
export function getCommentIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENT_IDS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Clear all indexed data (useful for testing or reset)
 */
export function clearIndex(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Also clear author-specific and suit-specific keys
    // Note: This is a simplified approach - in production, you'd track all keys
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('suitter_')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing index:', error)
  }
}

/**
 * Extract object IDs from a transaction result
 * This is a helper to parse transaction results and extract created object IDs
 */
export function extractObjectIdsFromTransaction(
  txResult: any,
  objectType?: string
): string[] {
  const objectIds: string[] = []

  try {
    // Check objectChanges
    if (txResult.objectChanges) {
      txResult.objectChanges.forEach((change: any) => {
        if (change.type === 'created' || change.type === 'published') {
          const objId = change.objectId || change.packageId
          const type = change.objectType || change.type

          if (objId) {
            if (!objectType || (type && type.includes(objectType))) {
              objectIds.push(objId)
            }
          }
        }
      })
    }

    // Check effects for created objects
    if (txResult.effects?.created) {
      txResult.effects.created.forEach((obj: any) => {
        if (obj.reference?.objectId) {
          objectIds.push(obj.reference.objectId)
        }
      })
    }
  } catch (error) {
    console.error('Error extracting object IDs:', error)
  }

  return objectIds
}

