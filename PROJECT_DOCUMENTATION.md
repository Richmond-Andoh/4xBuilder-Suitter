# Suitter - Complete Project Documentation

## Overview

Suitter is a decentralized social network built on the Sui blockchain. The project consists of two main components:

1. **Frontend** (`suitter/`): A React-based web application with TypeScript
2. **Smart Contracts** (`suitter-contracts/`): Move smart contracts deployed on Sui blockchain

This documentation provides a comprehensive guide to the project structure, integration, and usage.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contract Documentation](#smart-contract-documentation)
3. [Frontend Integration](#frontend-integration)
4. [Function-by-Function Integration Guide](#function-by-function-integration-guide)
5. [Setup and Deployment](#setup-and-deployment)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- React Router v6 for navigation
- Tailwind CSS for styling
- @mysten/sui.js for blockchain interactions
- Vite for build tooling
- Framer Motion for animations

**Smart Contract:**
- Move programming language
- Sui blockchain runtime

### Project Structure

```
4xBuilder-Suitter/
├── suitter/                    # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── PostCard.tsx   # Post display component
│   │   │   ├── CreatePostModal.tsx  # Post creation modal
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.tsx   # Main feed
│   │   │   ├── ProfilePage.tsx # User profiles
│   │   │   ├── PostDetailPage.tsx # Post detail view
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useSui.ts      # Blockchain interactions
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx # Authentication
│   │   │   └── ThemeContext.tsx # Theme management
│   │   └── lib/               # Utilities and types
│   │       ├── suitterQueries.ts # On-chain queries
│   │       ├── objectIndex.ts    # Object ID tracking
│   │       ├── constants.ts      # App constants
│   │       └── types.ts          # TypeScript interfaces
│   └── package.json
│
└── suitter-contracts/          # Smart contracts
    └── suitter/
        ├── sources/
        │   └── suitter.move    # Main contract
        └── Move.toml
```

---

## Smart Contract Documentation

### Contract: `suitter::suitter`

**Package ID:** Set via `VITE_SUITTER_PACKAGE_ID` environment variable

### Data Structures

#### 1. Profile
Represents a user profile on-chain. Owned by the user.

```move
public struct Profile has key, store {
    id: UID,
    owner: address,
    username: String,
    bio: String,
    image_url: String,
}
```

**Fields:**
- `id`: Unique identifier
- `owner`: Address of the profile owner
- `username`: User's chosen username
- `bio`: User's bio text
- `image_url`: URL to profile image

#### 2. Suit (Post)
Represents a social media post. Shared publicly.

```move
public struct Suit has key, store {
    id: UID,
    author: address,
    content: String,
    timestamp_ms: u64,
}
```

**Fields:**
- `id`: Unique identifier
- `author`: Address of the post author
- `content`: Post content text
- `timestamp_ms`: Creation timestamp in milliseconds

#### 3. Like
Represents a like on a post. Shared publicly.

```move
public struct Like has key, store {
    id: UID,
    suit_id: ID,
    liker: address,
}
```

**Fields:**
- `id`: Unique identifier
- `suit_id`: ID of the post being liked
- `liker`: Address of the user who liked

#### 4. Comment
Represents a comment on a post. Shared publicly.

```move
public struct Comment has key, store {
    id: UID,
    suit_id: ID,
    author: address,
    content: String,
    timestamp_ms: u64,
}
```

**Fields:**
- `id`: Unique identifier
- `suit_id`: ID of the post being commented on
- `author`: Address of the comment author
- `content`: Comment text
- `timestamp_ms`: Creation timestamp in milliseconds

### Functions

#### Profile Functions

**`create_profile(username: vector<u8>, bio: vector<u8>, image_url: vector<u8>, ctx: &mut TxContext)`**
- Creates a new user profile
- Transfers ownership to the caller
- **Note:** Each address can only have one profile

**`update_profile(profile: &mut Profile, new_username: vector<u8>, new_bio: vector<u8>, new_image_url: vector<u8>, ctx: &TxContext)`**
- Updates an existing profile
- Only the profile owner can update
- Requires the profile object ID

#### Post Functions

**`post_suit(content: vector<u8>, ctx: &mut TxContext)`**
- Creates a new post (Suit)
- Publishes it as a shared object
- Timestamp is automatically set

#### Interaction Functions

**`add_like(suit_id: ID, ctx: &mut TxContext)`**
- Adds a like to a post
- Creates a Like object and shares it publicly
- **Note:** Likes are permanent (no unlike function)

**`add_comment(suit_id: ID, content: vector<u8>, ctx: &mut TxContext)`**
- Adds a comment to a post
- Creates a Comment object and shares it publicly

---

## Frontend Integration

### Core Integration Files

#### 1. `src/hooks/useSui.ts`
Main hook for blockchain interactions. Provides all contract functions as React hooks.

**Key Functions:**
- `createProfile(username, bio, imageUrl)` - Create user profile
- `updateProfile(profileObjectId, newUsername?, newBio?, newImageUrl?)` - Update profile
- `getProfile(address)` - Get user profile
- `createPost(content, images?)` - Create a new post
- `getPosts(limit, offset)` - Get all posts
- `getPostById(postId)` - Get single post
- `getPostsByAuthor(authorAddress, limit, offset)` - Get posts by author
- `likePost(suitId)` - Like a post
- `commentOnPost(suitId, content)` - Comment on a post
- `getComments(suitId)` - Get comments for a post

#### 2. `src/lib/suitterQueries.ts`
On-chain query service for reading contract data.

**Functions:**
- `queryProfileByOwner(client, ownerAddress)` - Query profile
- `querySuitById(client, suitId)` - Query single post
- `queryAllSuits(client, suitIds)` - Query multiple posts
- `querySuitsByAuthor(client, authorAddress, suitIds)` - Query posts by author
- `queryLikesBySuitId(client, suitId, likeIds)` - Query likes
- `queryCommentsBySuitId(client, suitId, commentIds)` - Query comments

#### 3. `src/lib/objectIndex.ts`
Utility for tracking shared object IDs using localStorage.

**Important:** Since Suits, Likes, and Comments are shared objects, their IDs must be tracked to query them. This utility maintains indexes in localStorage.

**Functions:**
- `addSuitId(suitId, authorAddress)` - Index a new post
- `addLikeId(likeId, suitId)` - Index a new like
- `addCommentId(commentId, suitId)` - Index a new comment
- `getSuitIds()` - Get all post IDs
- `getAuthorSuitIds(authorAddress)` - Get post IDs by author
- `getSuitLikeIds(suitId)` - Get like IDs for a post
- `getSuitCommentIds(suitId)` - Get comment IDs for a post

---

## Function-by-Function Integration Guide

### 1. Profile Creation ✅

**Status:** Integrated in AuthContext (optional)

**Location:** `src/context/AuthContext.tsx`

**Implementation:**
- Profile creation can be triggered when wallet connects
- Alternatively, users can create profiles manually via ProfilePage

**Usage:**
```typescript
import { useSui } from '@/hooks/useSui'

const { createProfile } = useSui()

// Create profile
await createProfile('myusername', 'My bio', 'https://example.com/avatar.jpg')
```

### 2. Profile Update ✅

**Status:** Fully integrated

**Location:** `src/pages/ProfilePage.tsx`

**Implementation:**
- Edit Profile dialog connects to `updateProfile` function
- Updates profile on-chain when user saves changes
- Automatically reloads profile data after update

**Usage:**
```typescript
const { updateProfile, profileObjectId } = useSui()

await updateProfile(
  profileObjectId,
  'newusername',  // Optional
  'New bio',      // Optional
  'https://example.com/new-avatar.jpg' // Optional
)
```

### 3. Post Creation ✅

**Status:** Fully integrated

**Location:** `src/components/CreatePostModal.tsx`

**Implementation:**
- Post creation form connects to `createPost` function
- Automatically indexes new post IDs
- Shows loading state during transaction

**Usage:**
```typescript
const { createPost } = useSui()

await createPost('Hello, Suitter!', []) // content, images
```

### 4. Post Retrieval ✅

**Status:** Fully integrated

**Location:** `src/pages/HomePage.tsx`, `src/pages/ProfilePage.tsx`

**Implementation:**
- HomePage loads posts using `getPosts()`
- ProfilePage loads user posts using `getPostsByAuthor()`
- Both fall back to mock data if no posts found

**Usage:**
```typescript
const { getPosts, getPostsByAuthor } = useSui()

// Get all posts
const posts = await getPosts(20, 0) // limit, offset

// Get posts by author
const userPosts = await getPostsByAuthor(address, 20, 0)
```

### 5. Like Functionality ✅

**Status:** Fully integrated

**Location:** `src/pages/HomePage.tsx`, `src/pages/PostDetailPage.tsx`

**Implementation:**
- Like buttons connect to `likePost` function
- Optimistic UI updates for better UX
- Automatically indexes new like IDs

**Usage:**
```typescript
const { likePost } = useSui()

await likePost(suitId)
```

**Note:** The smart contract doesn't support unliking. Likes are permanent.

### 6. Comment Functionality ✅

**Status:** Fully integrated

**Location:** `src/pages/PostDetailPage.tsx`

**Implementation:**
- Comment form connects to `commentOnPost` function
- Automatically indexes new comment IDs
- Reloads comments after successful submission

**Usage:**
```typescript
const { commentOnPost, getComments } = useSui()

// Post a comment
await commentOnPost(suitId, 'Great post!')

// Get comments
const comments = await getComments(suitId)
```

---

## Setup and Deployment

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Sui CLI installed
- Slush wallet browser extension (or other Sui wallet)

### Environment Variables

Create a `.env` file in the `suitter` directory:

```env
# Sui Network Configuration
# Options: devnet, testnet, mainnet
VITE_SUI_NETWORK=testnet

# Suitter Smart Contract Package ID
# Replace with your deployed package ID after deployment
VITE_SUITTER_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd suitter
pnpm install
```

2. **Set environment variables:**
```bash
# Create .env file with VITE_SUITTER_PACKAGE_ID
```

3. **Start development server:**
```bash
pnpm dev
```

4. **Build for production:**
```bash
pnpm build
```

### Smart Contract Deployment

1. **Navigate to contract directory:**
```bash
cd suitter-contracts/suitter
```

2. **Deploy contract:**
```bash
sui client publish --gas-budget 100000000
```

3. **Note the Package ID** from the deployment output

4. **Update `.env`** in the frontend with the package ID

---

## Usage Examples

### Complete User Flow

#### 1. Connect Wallet
```typescript
import { useAuth } from '@/context/AuthContext'

const { connectWallet } = useAuth()
await connectWallet()
```

#### 2. Create Profile (if needed)
```typescript
const { createProfile } = useSui()
await createProfile('myusername', 'My bio', 'https://avatar.jpg')
```

#### 3. Create a Post
```typescript
const { createPost } = useSui()
const txDigest = await createPost('Hello, Suitter!')
```

#### 4. Like a Post
```typescript
const { likePost } = useSui()
await likePost('0x...suit_id...')
```

#### 5. Comment on a Post
```typescript
const { commentOnPost } = useSui()
await commentOnPost('0x...suit_id...', 'Great post!')
```

#### 6. View Profile
```typescript
const { getProfile } = useSui()
const profile = await getProfile('0x...address...')
```

---

## Important Considerations

### Shared Objects Indexing

**Critical:** Since Suits, Likes, and Comments are shared objects in Sui, you cannot query them without knowing their object IDs.

**Current Implementation:**
- Uses localStorage to track object IDs
- Automatically indexes IDs when creating posts, likes, or comments

**Production Considerations:**
- Use a database to store object IDs
- Use a Sui indexer service
- Maintain server-side indexes
- Consider using Sui's event system for tracking

### Object ID Extraction

The integration automatically extracts object IDs from transaction results using `extractObjectIdsFromTransaction()`. This happens when:
- Creating posts
- Liking posts
- Commenting on posts
- Creating profiles

### Error Handling

All blockchain operations should be wrapped in try-catch blocks:

```typescript
try {
  await createPost('Hello!')
  toast({ description: 'Post created!' })
} catch (error: any) {
  toast({
    title: 'Error',
    description: error?.message || 'Failed to create post',
    variant: 'destructive',
  })
}
```

### Loading States

Always show loading states during blockchain operations:

```typescript
const [isPosting, setIsPosting] = useState(false)

const handlePost = async () => {
  setIsPosting(true)
  try {
    await createPost(content)
  } finally {
    setIsPosting(false)
  }
}
```

### Optimistic Updates

For better UX, update UI optimistically before confirming blockchain transactions:

```typescript
// Update UI immediately
setPosts([...posts, newPost])

try {
  await createPost(content)
  // Transaction confirmed
} catch (error) {
  // Revert optimistic update
  setPosts(posts)
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Wallet not connected" error
**Solution:**
- Ensure wallet is connected via `connectWallet()`
- Check that `window.slushWallet` is available
- Verify wallet extension is installed and unlocked

#### 2. "Profile object ID is required" error
**Solution:**
- Ensure user has created a profile first
- The `profileObjectId` is automatically loaded when address changes
- Check that the profile object exists on-chain

#### 3. Empty query results
**Solution:**
- Shared objects require IDs to query - ensure you're maintaining an index
- Check that object IDs are correct
- Verify package ID is set correctly in environment variables
- Ensure you've created some posts/likes/comments first

#### 4. Transaction failures
**Solution:**
- Check you have sufficient SUI for gas fees
- Verify package ID matches deployed contract
- Ensure function arguments match the contract signature
- Check network (testnet/devnet/mainnet) matches

#### 5. Profile not loading
**Solution:**
- Verify the address is correct
- Check that a profile exists for that address
- Ensure network configuration matches contract deployment

### Debugging Tips

1. **Check browser console** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Check localStorage** for indexed object IDs (`suitter_*` keys)
4. **Inspect transaction results** in Sui Explorer using transaction digest
5. **Use Sui CLI** to query objects directly:
   ```bash
   sui client object <OBJECT_ID>
   ```

---

## Future Enhancements

### Planned Features

1. **Following System:** Add follow/unfollow functionality to smart contract
2. **Unlike Feature:** Add ability to unlike posts
3. **Post Deletion:** Add delete post functionality
4. **Resharing:** Add reshare/quote post feature
5. **Notifications:** On-chain notification system
6. **Better Indexing:** Move from localStorage to database/indexer
7. **Image Support:** Add image storage/upload functionality
8. **Hashtags:** Add hashtag support in posts
9. **Mentions:** Add @mention functionality

### Production Considerations

1. **Indexing Service:** Implement proper indexing for shared objects
2. **Caching:** Add caching layer for frequently accessed data
3. **Rate Limiting:** Implement rate limiting for API calls
4. **Error Monitoring:** Add error tracking and monitoring
5. **Analytics:** Add user analytics and engagement metrics
6. **SEO:** Optimize for search engines
7. **Mobile App:** Build mobile applications

---

## API Reference

### useSui Hook

Complete API reference for the `useSui` hook:

```typescript
const {
  // Profile operations
  createProfile,
  updateProfile,
  getProfile,
  profileObjectId,
  
  // Post operations
  createPost,
  deletePost,
  getPosts,
  getPostById,
  getPostsByAuthor,
  
  // Interaction operations
  likePost,
  unlikePost,
  resharePost,
  commentOnPost,
  getComments,
  
  // Utilities
  estimateGas,
  getSuiClient,
} = useSui()
```

### Type Definitions

See `src/lib/types.ts` for complete TypeScript type definitions.

---

## Contributing

When contributing to this project:

1. Follow the existing code style
2. Add TypeScript types for all functions
3. Include error handling
4. Add loading states
5. Test with testnet before deploying to mainnet
6. Update documentation for new features

---

## License

MIT

---

## Support

For issues, questions, or contributions:
- Check existing documentation
- Review code comments
- Open an issue on the repository
- Contact the development team

---

**Last Updated:** 2024
**Version:** 1.0.0

