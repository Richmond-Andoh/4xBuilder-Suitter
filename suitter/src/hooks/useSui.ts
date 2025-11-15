import { useCallback, useState, useEffect } from 'react'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useAuth } from '@/context/AuthContext'
import { useSignAndExecuteTransaction, useCurrentWallet } from '@mysten/dapp-kit'
import { User, Post, Reply } from '@/lib/types'
import { SUITTER_PACKAGE_ID, SUITTER_MODULE } from '@/lib/constants'
import {
  queryProfileByOwner,
  querySuitById,
  querySuitsByAuthor,
  queryLikesBySuitId,
  queryCommentsBySuitId,
  checkIfLiked,
  queryAllSuits,
  type OnChainProfile,
  type OnChainSuit,
  type OnChainLike,
  type OnChainComment,
} from '@/lib/suitterQueries'
import {
  addSuitId,
  addLikeId,
  addCommentId,
  getSuitIds,
  getAuthorSuitIds,
  getSuitLikeIds,
  getSuitCommentIds,
  extractObjectIdsFromTransaction,
} from '@/lib/objectIndex'

// Sui network configuration
const SUI_NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet' // Change to 'mainnet' for production
const FULLNODE_URL = getFullnodeUrl(SUI_NETWORK)

let suiClient: SuiClient | null = null

export function getSuiClient(): SuiClient {
  if (!suiClient) {
    suiClient = new SuiClient({ url: FULLNODE_URL })
  }
  return suiClient
}

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
 * Convert on-chain Suit to app Post type
 */
async function onChainSuitToPost(
  suit: OnChainSuit,
  client: SuiClient,
  currentUserAddress?: string
): Promise<Post> {
  // Get profile for author
  const authorProfile = await queryProfileByOwner(client, suit.author)
  
  // Get likes and comments from index
  const likeIds = getSuitLikeIds(suit.id)
  const commentIds = getSuitCommentIds(suit.id)
  
  const likes = await queryLikesBySuitId(client, suit.id, likeIds)
  const comments = await queryCommentsBySuitId(client, suit.id, commentIds)
  
  // Check if current user liked this post
  const liked = currentUserAddress ? await checkIfLiked(client, suit.id, currentUserAddress, likeIds) : false

  return {
    id: suit.id,
    authorId: suit.author,
    author: authorProfile
      ? onChainProfileToUser(authorProfile, suit.author)
      : {
          id: suit.author.slice(0, 10),
          address: suit.author,
          username: `${suit.author.slice(0, 6)}...${suit.author.slice(-4)}`,
          displayName: suit.author.slice(0, 6),
          bio: '',
          avatar: '/placeholder-user.jpg',
          banner: '/placeholder.jpg',
          joinedAt: new Date(),
          followersCount: 0,
          followingCount: 0,
        },
    content: suit.content,
    images: [], // Images not supported in current contract
    createdAt: new Date(suit.timestamp_ms),
    likeCount: likes.length,
    reshareCount: 0, // Not supported in contract
    replyCount: comments.length,
    liked,
    reshared: false, // Not supported in contract
    bookmarked: false, // Not supported in contract
  }
}

export function useSui() {
  const { state } = useAuth()
  const [profileObjectId, setProfileObjectId] = useState<string | null>(null)
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const { currentWallet } = useCurrentWallet()

  // Load profile object ID when address changes
  useEffect(() => {
    if (state.address) {
      loadProfileObjectId(state.address)
    } else {
      setProfileObjectId(null)
    }
  }, [state.address])

  const loadProfileObjectId = async (address: string) => {
    try {
      const client = getSuiClient()
      const structType = `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::Profile`
      const objects = await client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: structType,
        },
        options: {
          showContent: false,
        },
      })

      if (objects.data.length > 0) {
        setProfileObjectId(objects.data[0].data?.objectId || null)
      }
    } catch (error) {
      console.error('Error loading profile object ID:', error)
    }
  }

  // Profile operations
  const createProfile = useCallback(
    async (
      username: string,
      bio: string,
      imageUrl: string = ''
    ): Promise<string> => {
      if (!state.address || !currentWallet) {
        throw new Error('Wallet not connected')
      }

      return new Promise((resolve, reject) => {
        const tx = new Transaction()

        tx.moveCall({
          target: `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::create_profile`,
          arguments: [
            tx.pure.string(username),
            tx.pure.string(bio),
            tx.pure.string(imageUrl),
          ],
        })

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              try {
                // Try to extract object IDs from result directly
                let objectIds = extractObjectIdsFromTransaction(result, 'Profile')
                
                // If not found, fetch full transaction details using digest
                if (objectIds.length === 0 && result.digest) {
                  const client = getSuiClient()
                  const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                      showEffects: true,
                      showObjectChanges: true,
                    },
                  })
                  objectIds = extractObjectIdsFromTransaction(txDetails, 'Profile')
                }
                
                if (objectIds.length > 0) {
                  setProfileObjectId(objectIds[0])
                } else {
                  // Fallback: reload profile object ID
                  await loadProfileObjectId(state.address!)
                }
              } catch (error) {
                console.error('Error extracting profile object ID:', error)
                // Fallback: reload profile object ID
                await loadProfileObjectId(state.address!)
              }

              resolve(result.digest)
            },
            onError: (error) => {
              reject(error)
            },
          }
        )
      })
    },
    [state.address, currentWallet, signAndExecuteTransaction]
  )

  const updateProfile = useCallback(
    async (
      profileObjectId: string,
      newUsername?: string,
      newBio?: string,
      newImageUrl?: string
    ): Promise<string> => {
      if (!state.address || !currentWallet) {
        throw new Error('Wallet not connected')
      }

      if (!profileObjectId) {
        throw new Error('Profile object ID is required')
      }

      return new Promise((resolve, reject) => {
        const tx = new Transaction()

        // Get the profile object
        const profileArg = tx.object(profileObjectId)

        // Use current values if new values not provided
        getSuiClient()
          .then(client => queryProfileByOwner(client, state.address!))
          .then(currentProfile => {
            const username = newUsername ?? currentProfile?.username ?? ''
            const bio = newBio ?? currentProfile?.bio ?? ''
            const imageUrl = newImageUrl ?? currentProfile?.image_url ?? ''

            tx.moveCall({
              target: `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::update_profile`,
              arguments: [
                profileArg,
                tx.pure.string(username),
                tx.pure.string(bio),
                tx.pure.string(imageUrl),
              ],
            })

            signAndExecuteTransaction(
              {
                transaction: tx,
              },
              {
                onSuccess: (result) => {
                  resolve(result.digest)
                },
                onError: (error) => {
                  reject(error)
                },
              }
            )
          })
          .catch(reject)
      })
    },
    [state.address, currentWallet, signAndExecuteTransaction]
  )

  const getProfile = useCallback(
    async (address: string): Promise<User | null> => {
      const client = getSuiClient()
      const profile = await queryProfileByOwner(client, address)
      
      if (!profile) {
        return null
      }

      return onChainProfileToUser(profile, address)
    },
    []
  )

  // Post operations
  const createPost = useCallback(
    async (content: string, images: string[] = []): Promise<string> => {
      if (!state.address || !currentWallet) {
        throw new Error('Wallet not connected')
      }

      if (content.length > 280) {
        throw new Error('Post content exceeds 280 characters')
      }

      return new Promise((resolve, reject) => {
        const tx = new Transaction()

        tx.moveCall({
          target: `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::post_suit`,
          arguments: [tx.pure.string(content)],
        })

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              try {
                console.log('[createPost] Transaction result:', result)
                
                // Try to extract object IDs from result directly
                let objectIds = extractObjectIdsFromTransaction(result, 'Suit')
                console.log('[createPost] Object IDs from result:', objectIds)
                
                // If not found, fetch full transaction details using digest
                if (objectIds.length === 0 && result.digest) {
                  console.log('[createPost] No object IDs in result, fetching transaction details...')
                  const client = getSuiClient()
                  const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                      showEffects: true,
                      showObjectChanges: true,
                      showInput: true,
                    },
                  })
                  console.log('[createPost] Transaction details:', txDetails)
                  objectIds = extractObjectIdsFromTransaction(txDetails, 'Suit')
                  console.log('[createPost] Object IDs from transaction details:', objectIds)
                }
                
                if (objectIds.length > 0 && state.address) {
                  console.log(`[createPost] Adding suit ID ${objectIds[0]} for author ${state.address}`)
                  addSuitId(objectIds[0], state.address)
                  
                  // Verify it was added
                  const verifyIds = getSuitIds()
                  console.log(`[createPost] Verification - Total suit IDs in index: ${verifyIds.length}`)
                  console.log(`[createPost] Verification - Index includes new ID: ${verifyIds.includes(objectIds[0])}`)
                } else {
                  console.warn('[createPost] Could not extract suit ID or author address missing', {
                    objectIds,
                    address: state.address
                  })
                }
              } catch (error) {
                console.error('[createPost] Error extracting object IDs:', error)
              }
              
              resolve(result.digest)
            },
            onError: (error) => {
              console.error('[createPost] Transaction error:', error)
              reject(error)
            },
          }
        )
      })
    },
    [state.address, currentWallet, signAndExecuteTransaction]
  )

  const deletePost = useCallback(
    async (postId: string): Promise<string> => {
      // Note: The smart contract doesn't have a delete function
      // This would need to be implemented in the contract
      throw new Error('Delete post is not supported by the smart contract')
    },
    []
  )

  const getPosts = useCallback(
    async (limit = 20, offset = 0): Promise<Post[]> => {
      const client = getSuiClient()
      
      // Get Suit IDs from index
      const suitIds = getSuitIds()
      console.log(`[getPosts] Total suit IDs in index: ${suitIds.length}`)
      
      if (suitIds.length === 0) {
        console.log('[getPosts] No suit IDs found in index')
        return []
      }

      const paginatedIds = suitIds.slice(offset * limit, (offset * limit) + limit)
      console.log(`[getPosts] Paginated IDs (offset ${offset}, limit ${limit}):`, paginatedIds)
      
      if (paginatedIds.length === 0) {
        console.log('[getPosts] No IDs in paginated slice')
        return []
      }

      // Query suits by IDs
      const suits = await queryAllSuits(client, paginatedIds)
      console.log(`[getPosts] Queried ${suits.length} suits from chain`)
      
      // Convert to Post objects
      const posts = await Promise.all(
        suits.map(suit => onChainSuitToPost(suit, client, state.address || undefined))
      )
      
      console.log(`[getPosts] Converted to ${posts.length} posts`)
      return posts
    },
    [state.address]
  )

  const getPostById = useCallback(
    async (postId: string): Promise<Post | null> => {
      const client = getSuiClient()
      const suit = await querySuitById(client, postId)
      
      if (!suit) {
        return null
      }

      return onChainSuitToPost(suit, client, state.address || undefined)
    },
    [state.address]
  )

  const getPostsByAuthor = useCallback(
    async (authorAddress: string, limit = 20, offset = 0): Promise<Post[]> => {
      const client = getSuiClient()
      
      // Get Suit IDs for this author from index
      const authorSuitIds = getAuthorSuitIds(authorAddress)
      console.log(`[getPostsByAuthor] Author: ${authorAddress}, Total suit IDs: ${authorSuitIds.length}`)
      
      if (authorSuitIds.length === 0) {
        console.log(`[getPostsByAuthor] No suit IDs found for author ${authorAddress}`)
        return []
      }

      const paginatedIds = authorSuitIds.slice(offset * limit, (offset * limit) + limit)
      console.log(`[getPostsByAuthor] Paginated IDs (offset ${offset}, limit ${limit}):`, paginatedIds)
      
      if (paginatedIds.length === 0) {
        console.log(`[getPostsByAuthor] No IDs in paginated slice for author ${authorAddress}`)
        return []
      }

      // Query suits by IDs and filter by author
      const suits = await querySuitsByAuthor(client, authorAddress, paginatedIds)
      console.log(`[getPostsByAuthor] Queried ${suits.length} suits from chain for author ${authorAddress}`)
      
      // Convert to Post objects
      const posts = await Promise.all(
        suits.map(suit => onChainSuitToPost(suit, client, state.address || undefined))
      )
      
      console.log(`[getPostsByAuthor] Converted to ${posts.length} posts for author ${authorAddress}`)
      return posts
    },
    [state.address]
  )

  // Interaction operations
  const likePost = useCallback(
    async (suitId: string): Promise<string> => {
      if (!state.address || !currentWallet) {
        throw new Error('Wallet not connected')
      }

      return new Promise((resolve, reject) => {
        const tx = new Transaction()

        tx.moveCall({
          target: `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::add_like`,
          arguments: [tx.pure.id(suitId)],
        })

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              try {
                // Try to extract object IDs from result directly
                let objectIds = extractObjectIdsFromTransaction(result, 'Like')
                
                // If not found, fetch full transaction details using digest
                if (objectIds.length === 0 && result.digest) {
                  const client = getSuiClient()
                  const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                      showEffects: true,
                      showObjectChanges: true,
                    },
                  })
                  objectIds = extractObjectIdsFromTransaction(txDetails, 'Like')
                }
                
                if (objectIds.length > 0) {
                  addLikeId(objectIds[0], suitId)
                }
              } catch (error) {
                console.error('Error extracting like object ID:', error)
              }
              
              resolve(result.digest)
            },
            onError: (error) => {
              reject(error)
            },
          }
        )
      })
    },
    [state.address, currentWallet, signAndExecuteTransaction]
  )

  const unlikePost = useCallback(
    async (postId: string): Promise<string> => {
      // Note: The smart contract doesn't have an unlike function
      // Likes are permanent in the current contract design
      throw new Error('Unlike is not supported by the smart contract')
    },
    []
  )

  const resharePost = useCallback(
    async (postId: string): Promise<string> => {
      // Note: The smart contract doesn't have a reshare function
      // This would need to be implemented in the contract
      throw new Error('Reshare is not supported by the smart contract')
    },
    []
  )

  const commentOnPost = useCallback(
    async (suitId: string, content: string, images: string[] = []): Promise<string> => {
      if (!state.address || !currentWallet) {
        throw new Error('Wallet not connected')
      }

      return new Promise((resolve, reject) => {
        const tx = new Transaction()

        tx.moveCall({
          target: `${SUITTER_PACKAGE_ID}::${SUITTER_MODULE}::add_comment`,
          arguments: [
            tx.pure.id(suitId),
            tx.pure.string(content),
          ],
        })

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              try {
                // Try to extract object IDs from result directly
                let objectIds = extractObjectIdsFromTransaction(result, 'Comment')
                
                // If not found, fetch full transaction details using digest
                if (objectIds.length === 0 && result.digest) {
                  const client = getSuiClient()
                  const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                      showEffects: true,
                      showObjectChanges: true,
                    },
                  })
                  objectIds = extractObjectIdsFromTransaction(txDetails, 'Comment')
                }
                
                if (objectIds.length > 0) {
                  addCommentId(objectIds[0], suitId)
                }
              } catch (error) {
                console.error('Error extracting comment object ID:', error)
              }
              
              resolve(result.digest)
            },
            onError: (error) => {
              reject(error)
            },
          }
        )
      })
    },
    [state.address, currentWallet, signAndExecuteTransaction]
  )

  const getComments = useCallback(
    async (suitId: string): Promise<Reply[]> => {
      const client = getSuiClient()
      
      // Get Comment IDs for this Suit from index
      const commentIds = getSuitCommentIds(suitId)
      
      // Query comments by IDs
      const comments = await queryCommentsBySuitId(client, suitId, commentIds)
      
      // Convert to Reply objects
      const replies = await Promise.all(
        comments.map(async (comment) => {
          const authorProfile = await queryProfileByOwner(client, comment.author)
          
          return {
            id: comment.id,
            postId: comment.suit_id,
            authorId: comment.author,
            author: authorProfile
              ? onChainProfileToUser(authorProfile, comment.author)
              : {
                  id: comment.author.slice(0, 10),
                  address: comment.author,
                  username: `${comment.author.slice(0, 6)}...${comment.author.slice(-4)}`,
                  displayName: comment.author.slice(0, 6),
                  bio: '',
                  avatar: '/placeholder-user.jpg',
                  banner: '/placeholder.jpg',
                  joinedAt: new Date(),
                  followersCount: 0,
                  followingCount: 0,
                },
            content: comment.content,
            images: [],
            createdAt: new Date(comment.timestamp_ms),
            likeCount: 0, // Comments don't have likes in contract
            liked: false,
            replies: [],
          }
        })
      )
      
      return replies
    },
    []
  )

  // Follow operations (not in smart contract, but kept for compatibility)
  const followUser = useCallback(
    async (userId: string): Promise<string> => {
      // Note: Follow functionality is not in the smart contract
      // This would need to be implemented in the contract or handled off-chain
      throw new Error('Follow is not supported by the smart contract')
    },
    []
  )

  const unfollowUser = useCallback(
    async (userId: string): Promise<string> => {
      // Note: Follow functionality is not in the smart contract
      throw new Error('Unfollow is not supported by the smart contract')
    },
    []
  )

  const getFollowers = useCallback(
    async (userId: string, limit = 20, offset = 0): Promise<User[]> => {
      // Not supported in contract
      return []
    },
    []
  )

  const getFollowing = useCallback(
    async (userId: string, limit = 20, offset = 0): Promise<User[]> => {
      // Not supported in contract
      return []
    },
    []
  )

  // Notification operations (not in smart contract)
  const getNotifications = useCallback(
    async (limit = 20, offset = 0) => {
      // Not supported in contract
      return []
    },
    []
  )

  const markNotificationRead = useCallback(
    async (notificationId: string): Promise<string> => {
      // Not supported in contract
      throw new Error('Notifications are not supported by the smart contract')
    },
    []
  )

  // Estimate gas for a transaction
  const estimateGas = useCallback(
    async (tx: Transaction): Promise<bigint> => {
      const client = getSuiClient()
      if (!state.address) {
        throw new Error('Wallet not connected')
      }

      try {
        // Dry run the transaction to estimate gas
        const dryRunResult = await client.dryRunTransactionBlock({
          transactionBlock: await tx.build({ client }),
        })
        
        // Return estimated gas (this is a simplified version)
        return BigInt(dryRunResult.effects?.gasUsed?.computationCost || 1000)
      } catch (error) {
        console.error('Error estimating gas:', error)
        return BigInt(1000) // Fallback
      }
    },
    [state.address]
  )

  return {
    // Profile
    createProfile,
    updateProfile,
    getProfile,
    profileObjectId, // Expose profile object ID for update operations
    // Posts
    createPost,
    deletePost,
    getPosts,
    getPostById,
    getPostsByAuthor,
    // Interactions
    likePost,
    unlikePost,
    resharePost,
    commentOnPost,
    getComments,
    // Follow (not in contract, but kept for compatibility)
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    // Notifications (not in contract)
    getNotifications,
    markNotificationRead,
    // Utilities
    estimateGas,
    getSuiClient,
  }
}
