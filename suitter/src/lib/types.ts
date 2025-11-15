// Core data types for Suitter

export interface User {
  id: string
  address: string
  username: string
  displayName: string
  bio: string
  avatar: string
  banner: string
  location?: string
  website?: string
  joinedAt: Date
  followersCount: number
  followingCount: number
  isVerified?: boolean
}

export interface Post {
  id: string
  authorId: string
  author: User
  content: string
  images: string[]
  createdAt: Date
  updatedAt?: Date
  likeCount: number
  reshareCount: number
  replyCount: number
  liked: boolean
  reshared: boolean
  bookmarked: boolean
  quotedPost?: Post
  isPinned?: boolean
}

export interface Reply {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  images: string[]
  createdAt: Date
  likeCount: number
  liked: boolean
  parentReplyId?: string
  replies: Reply[]
}

export interface Notification {
  id: string
  recipientId: string
  senderId: string
  sender: User
  type: 'follow' | 'like' | 'reshare' | 'reply' | 'mention'
  targetPostId?: string
  targetReplyId?: string
  message: string
  read: boolean
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  recipientId: string
  content: string
  images: string[]
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message
  lastMessageTime: Date
  unreadCount: number
}

export interface FollowRelationship {
  followerId: string
  followingId: string
  createdAt: Date
}

export interface NFT {
  id: string
  owner: string
  name: string
  collection: string
  image: string
  traits: Array<{ name: string; value: string }>
  explorerUrl: string
}

export interface AuthState {
  isConnected: boolean
  address: string | null
  user: User | null
}

