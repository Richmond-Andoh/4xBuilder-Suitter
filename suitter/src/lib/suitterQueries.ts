// On-chain query service for Suitter smart contract
import { SuiClient } from '@mysten/sui/client'
import { SUITTER_PACKAGE_ID, SUITTER_MODULE, SUITTER_STRUCTS } from './constants'

// On-chain data types matching the smart contract
export interface OnChainProfile {
  id: string
  owner: string
  username: string
  bio: string
  image_url: string
}

export interface OnChainSuit {
  id: string
  author: string
  content: string
  timestamp_ms: number
}

export interface OnChainLike {
  id: string
  suit_id: string
  liker: string
}

export interface OnChainComment {
  id: string
  suit_id: string
  author: string
  content: string
  timestamp_ms: number
}

/**
 * Get the full struct type name for querying
 */
function getStructType(structName: string): string {
  return `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::${structName}`
}

/**
 * Query all Suit (post) objects from the chain
 * Note: Since Suits are shared objects, we need to know their IDs to query them.
 * In production, you should maintain an index of Suit IDs (e.g., in a database or indexer).
 * This function accepts an optional array of Suit IDs to query.
 */
export async function queryAllSuits(
  client: SuiClient,
  suitIds?: string[]
): Promise<OnChainSuit[]> {
  try {
    if (!suitIds || suitIds.length === 0) {
      // If no IDs provided, return empty array
      // In production, fetch IDs from your index/database
      return []
    }

    // Query all suits by their IDs
    const objects = await client.multiGetObjects({
      ids: suitIds,
      options: {
        showContent: true,
        showType: true,
      },
    })

    const suits: OnChainSuit[] = []

    for (const object of objects) {
      if (object.data && 'content' in object.data && object.data.content) {
        const content = object.data.content as any
        if ('fields' in content) {
          suits.push({
            id: object.data.objectId,
            author: content.fields.author || '',
            content: content.fields.content || '',
            timestamp_ms: Number(content.fields.timestamp_ms || 0),
          })
        }
      }
    }

    // Sort by timestamp (newest first)
    return suits.sort((a, b) => b.timestamp_ms - a.timestamp_ms)
  } catch (error) {
    console.error('Error querying suits:', error)
    return []
  }
}

/**
 * Query a specific Suit by ID
 */
export async function querySuitById(
  client: SuiClient,
  suitId: string
): Promise<OnChainSuit | null> {
  try {
    const object = await client.getObject({
      id: suitId,
      options: {
        showContent: true,
        showType: true,
      },
    })

    if (object.data && 'content' in object.data && object.data.content) {
      const content = object.data.content as any
      if ('fields' in content) {
        return {
          id: object.data.objectId,
          author: content.fields.author || '',
          content: content.fields.content || '',
          timestamp_ms: Number(content.fields.timestamp_ms || 0),
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error querying suit by ID:', error)
    return null
  }
}

/**
 * Query Profile objects owned by a specific address
 */
export async function queryProfileByOwner(
  client: SuiClient,
  ownerAddress: string
): Promise<OnChainProfile | null> {
  try {
    const structType = getStructType(SUITTER_STRUCTS.PROFILE)
    const objects = await client.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: structType,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    if (objects.data.length === 0) {
      return null
    }

    // Get the first profile (users should only have one)
    const objectId = objects.data[0].data?.objectId
    if (!objectId) return null

    const object = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showType: true,
      },
    })

    if (object.data && 'content' in object.data && object.data.content) {
      const content = object.data.content as any
      if ('fields' in content) {
        return {
          id: object.data.objectId,
          owner: content.fields.owner || '',
          username: content.fields.username || '',
          bio: content.fields.bio || '',
          image_url: content.fields.image_url || '',
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error querying profile:', error)
    return null
  }
}

/**
 * Query all Like objects for a specific Suit
 * Note: Since Likes are shared objects, we need to know their IDs to query them.
 * In production, maintain an index mapping suit_id -> like_ids.
 * This function accepts an optional array of Like IDs to query.
 */
export async function queryLikesBySuitId(
  client: SuiClient,
  suitId: string,
  likeIds?: string[]
): Promise<OnChainLike[]> {
  try {
    if (!likeIds || likeIds.length === 0) {
      // If no IDs provided, return empty array
      // In production, fetch IDs from your index/database
      return []
    }

    // Query all likes by their IDs
    const objects = await client.multiGetObjects({
      ids: likeIds,
      options: {
        showContent: true,
        showType: true,
      },
    })

    const likes: OnChainLike[] = []

    for (const object of objects) {
      if (object.data && 'content' in object.data && object.data.content) {
        const content = object.data.content as any
        if ('fields' in content) {
          const like: OnChainLike = {
            id: object.data.objectId,
            suit_id: content.fields.suit_id || '',
            liker: content.fields.liker || '',
          }
          
          // Filter by suit_id
          if (like.suit_id === suitId) {
            likes.push(like)
          }
        }
      }
    }

    return likes
  } catch (error) {
    console.error('Error querying likes:', error)
    return []
  }
}

/**
 * Query all Comment objects for a specific Suit
 * Note: Since Comments are shared objects, we need to know their IDs to query them.
 * In production, maintain an index mapping suit_id -> comment_ids.
 * This function accepts an optional array of Comment IDs to query.
 */
export async function queryCommentsBySuitId(
  client: SuiClient,
  suitId: string,
  commentIds?: string[]
): Promise<OnChainComment[]> {
  try {
    if (!commentIds || commentIds.length === 0) {
      // If no IDs provided, return empty array
      // In production, fetch IDs from your index/database
      return []
    }

    // Query all comments by their IDs
    const objects = await client.multiGetObjects({
      ids: commentIds,
      options: {
        showContent: true,
        showType: true,
      },
    })

    const comments: OnChainComment[] = []

    for (const object of objects) {
      if (object.data && 'content' in object.data && object.data.content) {
        const content = object.data.content as any
        if ('fields' in content) {
          const comment: OnChainComment = {
            id: object.data.objectId,
            suit_id: content.fields.suit_id || '',
            author: content.fields.author || '',
            content: content.fields.content || '',
            timestamp_ms: Number(content.fields.timestamp_ms || 0),
          }
          
          // Filter by suit_id
          if (comment.suit_id === suitId) {
            comments.push(comment)
          }
        }
      }
    }

    // Sort by timestamp (oldest first for comments)
    return comments.sort((a, b) => a.timestamp_ms - b.timestamp_ms)
  } catch (error) {
    console.error('Error querying comments:', error)
    return []
  }
}

/**
 * Query all Suits by a specific author
 * Note: Since Suits are shared objects, we need to know their IDs to query them.
 * In production, maintain an index mapping author -> suit_ids.
 * This function accepts an optional array of Suit IDs to query.
 */
export async function querySuitsByAuthor(
  client: SuiClient,
  authorAddress: string,
  suitIds?: string[]
): Promise<OnChainSuit[]> {
  try {
    // Query all suits and filter by author
    const allSuits = await queryAllSuits(client, suitIds)
    return allSuits.filter(suit => suit.author === authorAddress)
  } catch (error) {
    console.error('Error querying suits by author:', error)
    return []
  }
}

/**
 * Check if a user has liked a specific Suit
 * Note: Requires like IDs to be provided. In production, maintain an index.
 */
export async function checkIfLiked(
  client: SuiClient,
  suitId: string,
  userAddress: string,
  likeIds?: string[]
): Promise<boolean> {
  try {
    const likes = await queryLikesBySuitId(client, suitId, likeIds)
    return likes.some(like => like.liker === userAddress)
  } catch (error) {
    console.error('Error checking if liked:', error)
    return false
  }
}

