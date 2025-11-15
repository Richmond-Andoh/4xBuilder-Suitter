// Core data types for Suitter

export interface User {
  id: string;
  address: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  banner: string;
  location?: string;
  website?: string;
  joinedAt: Date;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}

export interface Suit {
  id: string;
  authorId: string;
  author: User;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
  resuitCount: number;
  commentCount: number;
  liked: boolean;
  resuited: boolean;
  bookmarked: boolean;
  quotedSuit?: Suit;
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  suitId: string;
  authorId: string;
  author: User;
  content: string;
  images: string[];
  createdAt: Date;
  likeCount: number;
  liked: boolean;
  parentCommentId?: string;
  replies: Comment[];
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  sender: User;
  type: 'follow' | 'like' | 'resuit' | 'comment' | 'mention';
  targetSuitId?: string;
  targetCommentId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  recipientId: string;
  content: string;
  images: string[];
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface FollowRelationship {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface NFT {
  id: string;
  owner: string;
  name: string;
  collection: string;
  image: string;
  traits: Array<{ name: string; value: string }>;
  explorerUrl: string;
}

export interface AuthState {
  isConnected: boolean;
  address: string | null;
  user: User | null;
}
