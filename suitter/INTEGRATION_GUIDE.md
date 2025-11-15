# Suitter Smart Contract Integration Guide

This guide explains how to use the complete smart contract integration for the Suitter application.

## Setup

### 1. Environment Variables

Create a `.env` file in the `suitter` directory with the following variables:

```env
# Sui Network Configuration
# Options: devnet, testnet, mainnet
VITE_SUI_NETWORK=testnet

# Suitter Smart Contract Package ID
# Replace with your deployed package ID after deployment
VITE_SUITTER_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
```

### 2. Package ID Configuration

After deploying your smart contract, update the `VITE_SUITTER_PACKAGE_ID` in your `.env` file with the actual package ID from the deployment.

## Available Functions

### Profile Operations

#### `createProfile(username: string, bio: string, imageUrl?: string): Promise<string>`

Creates a new user profile on-chain.

```typescript
const { createProfile } = useSui()

try {
  const txDigest = await createProfile(
    'myusername',
    'My bio text',
    'https://example.com/avatar.jpg'
  )
  console.log('Profile created:', txDigest)
} catch (error) {
  console.error('Failed to create profile:', error)
}
```

#### `updateProfile(profileObjectId: string, newUsername?: string, newBio?: string, newImageUrl?: string): Promise<string>`

Updates an existing profile. Requires the profile object ID.

```typescript
const { updateProfile, profileObjectId } = useSui()

if (profileObjectId) {
  try {
    const txDigest = await updateProfile(
      profileObjectId,
      'newusername',
      'New bio',
      'https://example.com/new-avatar.jpg'
    )
    console.log('Profile updated:', txDigest)
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}
```

#### `getProfile(address: string): Promise<User | null>`

Fetches a user's profile from the chain.

```typescript
const { getProfile } = useSui()

const profile = await getProfile('0x...')
if (profile) {
  console.log('Profile:', profile)
}
```

### Post Operations

#### `createPost(content: string, images?: string[]): Promise<string>`

Creates a new post (Suit) on-chain.

```typescript
const { createPost } = useSui()

try {
  const txDigest = await createPost('Hello, Suitter!')
  console.log('Post created:', txDigest)
  
  // Extract Suit ID from transaction result
  // You'll need to track this ID for future queries
} catch (error) {
  console.error('Failed to create post:', error)
}
```

**Important:** After creating a post, you need to extract the Suit object ID from the transaction result and store it in your index/database for future queries.

#### `getPostById(postId: string): Promise<Post | null>`

Fetches a specific post by its ID.

```typescript
const { getPostById } = useSui()

const post = await getPostById('0x...')
if (post) {
  console.log('Post:', post)
}
```

#### `getPostsByAuthor(authorAddress: string, limit?: number, offset?: number): Promise<Post[]>`

Fetches all posts by a specific author.

```typescript
const { getPostsByAuthor } = useSui()

// Note: This requires you to maintain an index of Suit IDs
// Pass suitIds as the second parameter in the query function
const posts = await getPostsByAuthor('0x...', 20, 0)
```

### Interaction Operations

#### `likePost(suitId: string): Promise<string>`

Likes a post (creates a Like object).

```typescript
const { likePost } = useSui()

try {
  const txDigest = await likePost('0x...')
  console.log('Post liked:', txDigest)
} catch (error) {
  console.error('Failed to like post:', error)
}
```

**Note:** The current smart contract doesn't support unliking. Likes are permanent.

#### `commentOnPost(suitId: string, content: string): Promise<string>`

Adds a comment to a post.

```typescript
const { commentOnPost } = useSui()

try {
  const txDigest = await commentOnPost('0x...', 'Great post!')
  console.log('Comment added:', txDigest)
} catch (error) {
  console.error('Failed to comment:', error)
}
```

#### `getComments(suitId: string): Promise<Reply[]>`

Fetches all comments for a specific post.

```typescript
const { getComments } = useSui()

// Note: This requires you to maintain an index of Comment IDs
const comments = await getComments('0x...')
```

## Important Notes

### Shared Objects and Indexing

Since Suits, Likes, and Comments are **shared objects** in Sui, you cannot query them directly without knowing their object IDs. You need to:

1. **Track Object IDs**: Maintain an index (database, local storage, or indexer) of:
   - All Suit IDs (for the feed)
   - Suit IDs by author (for user profiles)
   - Like IDs by Suit ID (for like counts)
   - Comment IDs by Suit ID (for comment threads)

2. **Extract IDs from Transactions**: When creating posts, likes, or comments, extract the object IDs from the transaction result:

```typescript
const result = await window.slushWallet.signAndExecuteTransaction({
  transactionBlock: tx,
})

// Extract created object IDs from result
// Store them in your index
```

3. **Use an Indexer**: For production, consider using a Sui indexer service to automatically track all object creations and maintain indexes.

### Transaction Result Parsing

After executing a transaction, you can extract object IDs from the result:

```typescript
const result = await window.slushWallet.signAndExecuteTransaction({
  transactionBlock: tx,
})

// The result contains created objects
// Parse the effects to get object IDs
const createdObjects = result.effects?.created || []
const objectIds = createdObjects.map(obj => obj.reference?.objectId)
```

### Functions Not Supported

The following functions are not available in the current smart contract:
- `deletePost` - Posts cannot be deleted
- `unlikePost` - Likes are permanent
- `resharePost` - Resharing is not implemented
- `followUser` / `unfollowUser` - Following is not implemented
- `getNotifications` - Notifications are not implemented

## Example: Complete Post Creation Flow

```typescript
import { useSui } from '@/hooks/useSui'
import { useAuth } from '@/context/AuthContext'

function CreatePostExample() {
  const { createPost } = useSui()
  const { state } = useAuth()
  const [suitIds, setSuitIds] = useState<string[]>([])

  const handleCreatePost = async (content: string) => {
    try {
      // Create the post
      const txDigest = await createPost(content)
      
      // In a real app, you'd parse the transaction result to get the Suit ID
      // For now, you'd need to query the transaction to get the created object
      const client = getSuiClient()
      const txResult = await client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      })
      
      // Extract the created Suit object ID
      const createdObjects = txResult.objectChanges?.filter(
        change => change.type === 'created'
      ) || []
      
      const suitId = createdObjects.find(
        obj => obj.objectType?.includes('Suit')
      )?.objectId
      
      if (suitId) {
        // Store in your index
        setSuitIds(prev => [...prev, suitId])
        // Or save to your database/indexer
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    // Your UI here
  )
}
```

## Query Functions

The integration includes query functions in `suitter/src/lib/suitterQueries.ts`:

- `querySuitById(client, suitId)` - Get a single Suit
- `queryAllSuits(client, suitIds?)` - Get multiple Suits by IDs
- `queryProfileByOwner(client, ownerAddress)` - Get user profile
- `queryLikesBySuitId(client, suitId, likeIds?)` - Get likes for a Suit
- `queryCommentsBySuitId(client, suitId, commentIds?)` - Get comments for a Suit
- `querySuitsByAuthor(client, authorAddress, suitIds?)` - Get Suits by author

All query functions require object IDs to be provided (except for Profile, which is owned).

## Best Practices

1. **Always handle errors**: Wrap contract calls in try-catch blocks
2. **Show loading states**: Display loading indicators during transactions
3. **Track object IDs**: Maintain an index of all created objects
4. **Use transactions efficiently**: Batch multiple operations when possible
5. **Handle wallet disconnection**: Check wallet connection before operations
6. **Validate inputs**: Check content length, required fields, etc.

## Troubleshooting

### "Wallet not connected" error
- Ensure the wallet is connected via `connectWallet()` from `useAuth()`
- Check that `window.slushWallet` is available

### "Profile object ID is required" error
- Ensure the user has created a profile first
- The `profileObjectId` is automatically loaded when the address changes
- Check that the profile object exists on-chain

### Empty query results
- Shared objects require IDs to query - ensure you're maintaining an index
- Check that the object IDs are correct
- Verify the package ID is set correctly in environment variables

### Transaction failures
- Check that you have sufficient SUI for gas fees
- Verify the package ID matches your deployed contract
- Ensure function arguments match the contract signature

