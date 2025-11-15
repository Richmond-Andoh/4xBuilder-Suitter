import { User, Post, Notification, Conversation, NFT } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    username: 'alice_sui',
    displayName: 'Alice Chen',
    bio: 'Building on Sui blockchain. Web3 enthusiast. 🚀',
    avatar: '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    location: 'San Francisco, CA',
    website: 'alice.sui',
    joinedAt: new Date('2024-01-15'),
    followersCount: 1250,
    followingCount: 342,
    isVerified: true,
  },
  {
    id: '2',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    username: 'bob_dev',
    displayName: 'Bob Developer',
    bio: 'Smart contract engineer. Move language expert.',
    avatar: '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    location: 'New York, NY',
    website: 'bob.dev',
    joinedAt: new Date('2024-02-20'),
    followersCount: 892,
    followingCount: 567,
  },
  {
    id: '3',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    username: 'charlie_nft',
    displayName: 'Charlie NFT',
    bio: 'NFT artist & collector. Sui ecosystem explorer.',
    avatar: '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    joinedAt: new Date('2024-03-10'),
    followersCount: 567,
    followingCount: 234,
  },
  {
    id: '4',
    address: '0xfedcba9876543210fedcba9876543210fedcba98',
    username: 'diana_web3',
    displayName: 'Diana Web3',
    bio: 'DeFi researcher. Interested in blockchain scalability.',
    avatar: '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    joinedAt: new Date('2024-01-05'),
    followersCount: 1890,
    followingCount: 456,
    isVerified: true,
  },
  {
    id: '5',
    address: '0x1111222233334444555566667777888899990000',
    username: 'evan_crypto',
    displayName: 'Evan Crypto',
    bio: 'Crypto trader & analyst.',
    avatar: '/placeholder-user.jpg',
    banner: '/placeholder.jpg',
    joinedAt: new Date('2024-02-01'),
    followersCount: 2340,
    followingCount: 789,
  },
]

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Just launched my new NFT collection on Sui! Minting is now live. 🎨 The gas fees are incredibly low and the transaction speed is amazing.',
    images: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likeCount: 342,
    reshareCount: 89,
    replyCount: 24,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: '2',
    authorId: '2',
    author: mockUsers[1],
    content: 'Sui mainnet is incredibly fast. Just executed 100k transactions in seconds. This is the future of blockchain technology.',
    images: [],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likeCount: 567,
    reshareCount: 234,
    replyCount: 56,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
  {
    id: '3',
    authorId: '3',
    author: mockUsers[2],
    content: 'Working on a new DEX protocol for Sui. Performance metrics are looking incredible. Can\'t wait to share more details soon!',
    images: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likeCount: 234,
    reshareCount: 89,
    replyCount: 34,
    liked: false,
    reshared: true,
    bookmarked: false,
  },
  {
    id: '4',
    authorId: '4',
    author: mockUsers[3],
    content: 'The Sui ecosystem is growing faster than ever. So many amazing projects launching. This is just the beginning! 🚀',
    images: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likeCount: 1203,
    reshareCount: 456,
    replyCount: 123,
    liked: false,
    reshared: false,
    bookmarked: true,
  },
  {
    id: '5',
    authorId: '5',
    author: mockUsers[4],
    content: 'SUI token hitting new highs. Market sentiment is incredibly bullish right now. What are your thoughts?',
    images: [],
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    likeCount: 789,
    reshareCount: 234,
    replyCount: 89,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: '1',
    recipientId: '1',
    senderId: '2',
    sender: mockUsers[1],
    type: 'follow',
    message: 'started following you',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    recipientId: '1',
    senderId: '3',
    sender: mockUsers[2],
    type: 'like',
    targetPostId: '1',
    message: 'liked your post',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '3',
    recipientId: '1',
    senderId: '4',
    sender: mockUsers[3],
    type: 'reshare',
    targetPostId: '1',
    message: 'reshared your post',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '4',
    recipientId: '1',
    senderId: '5',
    sender: mockUsers[4],
    type: 'reply',
    targetPostId: '1',
    message: 'replied to your post',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
]

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: '2',
      sender: mockUsers[1],
      recipientId: '1',
      content: 'Hey! How are you doing?',
      images: [],
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: '2',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: '3',
      sender: mockUsers[2],
      recipientId: '1',
      content: 'Thanks for the follow!',
      images: [],
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
]

export const mockNFTs: NFT[] = [
  {
    id: '1',
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Sui Ape #1234',
    collection: 'Sui Apes',
    image: '/placeholder.jpg',
    traits: [
      { name: 'Background', value: 'Blue' },
      { name: 'Eyes', value: 'Laser' },
      { name: 'Mouth', value: 'Smile' },
    ],
    explorerUrl: 'https://suiexplorer.com/object/0x1234',
  },
  {
    id: '2',
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Sui Ape #5678',
    collection: 'Sui Apes',
    image: '/placeholder.jpg',
    traits: [
      { name: 'Background', value: 'Red' },
      { name: 'Eyes', value: 'Normal' },
      { name: 'Mouth', value: 'Frown' },
    ],
    explorerUrl: 'https://suiexplorer.com/object/0x5678',
  },
]

export function getPosts(feedType: 'foryou' | 'following' = 'foryou'): Post[] {
  // In a real app, this would filter based on feed type
  return mockPosts
}

export function getNotifications(): Notification[] {
  return mockNotifications
}

export function getConversations(): Conversation[] {
  return mockConversations
}

// Mock messages for conversations
export const mockMessages: Message[] = [
  // Conversation 1 messages
  {
    id: 'msg-1-1',
    conversationId: '1',
    senderId: '2',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'Hey Alice! I saw your post about the new NFT collection. It looks amazing!',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'msg-1-2',
    conversationId: '1',
    senderId: '1',
    sender: mockUsers[0],
    recipientId: '2',
    content: 'Thanks Bob! I\'m really excited about it. The gas fees on Sui make it so affordable.',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
  },
  {
    id: 'msg-1-3',
    conversationId: '1',
    senderId: '2',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'Absolutely! The transaction speed is incredible too. Have you thought about adding more traits?',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
  },
  {
    id: 'msg-1-4',
    conversationId: '1',
    senderId: '1',
    sender: mockUsers[0],
    recipientId: '2',
    content: 'Yes! I\'m working on adding some rare traits. Should have them ready next week.',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'msg-1-5',
    conversationId: '1',
    senderId: '2',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'That sounds great! Can\'t wait to see them. Let me know when they\'re live!',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
  },
  {
    id: 'msg-1-6',
    conversationId: '1',
    senderId: '2',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'Hey! How are you doing?',
    images: [],
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  // Conversation 2 messages
  {
    id: 'msg-2-1',
    conversationId: '2',
    senderId: '3',
    sender: mockUsers[2],
    recipientId: '1',
    content: 'Hi Alice! Thanks for following me. I really appreciate your work in the Sui ecosystem!',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'msg-2-2',
    conversationId: '2',
    senderId: '1',
    sender: mockUsers[0],
    recipientId: '3',
    content: 'Thanks Charlie! Your NFT art is incredible. I\'d love to collaborate sometime.',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
  },
  {
    id: 'msg-2-3',
    conversationId: '2',
    senderId: '3',
    sender: mockUsers[2],
    recipientId: '1',
    content: 'That would be amazing! I\'m always open to collaborations. Let\'s discuss it further.',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'msg-2-4',
    conversationId: '2',
    senderId: '3',
    sender: mockUsers[2],
    recipientId: '1',
    content: 'Thanks for the follow!',
    images: [],
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

export function getMessages(conversationId: string): Message[] {
  return mockMessages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function getNFTs(owner?: string): NFT[] {
  if (owner) {
    return mockNFTs.filter(nft => nft.owner === owner)
  }
  return mockNFTs
}

export function getBookmarkedPosts(): Post[] {
  return mockPosts.filter(post => post.bookmarked)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id)
}

export function getPostById(id: string): Post | undefined {
  return mockPosts.find(post => post.id === id)
}

// Dummy replies (posts that are replies to other posts)
export const mockReplies: Post[] = [
  {
    id: 'reply-1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Great point! I completely agree with your analysis. The Sui ecosystem is definitely showing strong fundamentals.',
    images: [],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likeCount: 45,
    reshareCount: 12,
    replyCount: 8,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'reply-2',
    authorId: '1',
    author: mockUsers[0],
    content: 'Thanks for sharing this! I\'ve been following the project closely and it\'s exciting to see the progress.',
    images: [],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likeCount: 23,
    reshareCount: 5,
    replyCount: 3,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'reply-3',
    authorId: '1',
    author: mockUsers[0],
    content: 'This is exactly what I needed to hear. The transaction speed on Sui is unmatched!',
    images: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likeCount: 67,
    reshareCount: 18,
    replyCount: 12,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'reply-4',
    authorId: '1',
    author: mockUsers[0],
    content: 'Couldn\'t agree more. The Move language makes smart contract development so much safer.',
    images: [],
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    likeCount: 34,
    reshareCount: 9,
    replyCount: 6,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'reply-5',
    authorId: '1',
    author: mockUsers[0],
    content: 'Amazing work! Keep building on Sui. The community is here to support you! 🚀',
    images: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likeCount: 89,
    reshareCount: 24,
    replyCount: 15,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
]

// Dummy media posts (posts with images)
export const mockMediaPosts: Post[] = [
  {
    id: 'media-1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Just minted this amazing NFT on Sui! The artwork is incredible. 🎨',
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likeCount: 234,
    reshareCount: 67,
    replyCount: 34,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'media-2',
    authorId: '1',
    author: mockUsers[0],
    content: 'Screenshot from my latest DApp built on Sui. The UX is smooth as butter!',
    images: ['/placeholder.jpg'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likeCount: 189,
    reshareCount: 45,
    replyCount: 28,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'media-3',
    authorId: '1',
    author: mockUsers[0],
    content: 'My Sui ecosystem collection is growing! Here are some of my favorite projects.',
    images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likeCount: 312,
    reshareCount: 89,
    replyCount: 42,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'media-4',
    authorId: '1',
    author: mockUsers[0],
    content: 'Beautiful sunset view while coding on Sui. This blockchain is the future! 🌅',
    images: ['/placeholder.jpg'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likeCount: 156,
    reshareCount: 38,
    replyCount: 19,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'media-5',
    authorId: '1',
    author: mockUsers[0],
    content: 'New profile picture! Representing the Sui community with pride. 💪',
    images: ['/placeholder.jpg'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likeCount: 278,
    reshareCount: 72,
    replyCount: 51,
    liked: false,
    reshared: false,
    bookmarked: false,
  },
]

// Dummy liked posts (posts that the user has liked)
export const mockLikedPosts: Post[] = [
  {
    id: 'liked-1',
    authorId: '2',
    author: mockUsers[1],
    content: 'Sui mainnet is incredibly fast. Just executed 100k transactions in seconds. This is the future of blockchain technology.',
    images: [],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likeCount: 567,
    reshareCount: 234,
    replyCount: 56,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'liked-2',
    authorId: '5',
    author: mockUsers[4],
    content: 'SUI token hitting new highs. Market sentiment is incredibly bullish right now. What are your thoughts?',
    images: [],
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    likeCount: 789,
    reshareCount: 234,
    replyCount: 89,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'liked-3',
    authorId: '4',
    author: mockUsers[3],
    content: 'The Sui ecosystem is growing faster than ever. So many amazing projects launching. This is just the beginning! 🚀',
    images: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likeCount: 1203,
    reshareCount: 456,
    replyCount: 123,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'liked-4',
    authorId: '3',
    author: mockUsers[2],
    content: 'Working on a new DEX protocol for Sui. Performance metrics are looking incredible. Can\'t wait to share more details soon!',
    images: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likeCount: 234,
    reshareCount: 89,
    replyCount: 34,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
  {
    id: 'liked-5',
    authorId: '2',
    author: mockUsers[1],
    content: 'Just discovered an amazing DeFi protocol on Sui. The APY is incredible and the security is top-notch.',
    images: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likeCount: 445,
    reshareCount: 123,
    replyCount: 67,
    liked: true,
    reshared: false,
    bookmarked: false,
  },
]

export function getRepliesByUserId(userId: string): Post[] {
  return mockReplies.filter(reply => reply.authorId === userId)
}

export function getMediaPostsByUserId(userId: string): Post[] {
  return mockMediaPosts.filter(post => post.authorId === userId)
}

export function getLikedPostsByUserId(userId: string): Post[] {
  return mockLikedPosts
}