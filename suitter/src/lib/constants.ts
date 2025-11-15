// Constants for the Suitter app

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  NFT_GALLERY: '/nft-gallery',
  BOOKMARKS: '/bookmarks',
  LISTS: '/lists',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const THEME_OPTIONS = ['light', 'dark'] as const

export const MAX_POST_CHARS = 280

export const DEBOUNCE_DELAY = 300

export const NOTIFICATION_TYPES = [
  'follow',
  'like',
  'reshare',
  'reply',
  'mention',
] as const

// Smart Contract Configuration
// Get package ID from environment variable or use default
export const SUITTER_PACKAGE_ID = import.meta.env.VITE_SUITTER_PACKAGE_ID || '0x0'

// Module name from the smart contract
export const SUITTER_MODULE = 'suitter'

// Struct names from the smart contract
export const SUITTER_STRUCTS = {
  PROFILE: 'Profile',
  SUIT: 'Suit',
  LIKE: 'Like',
  COMMENT: 'Comment',
} as const

