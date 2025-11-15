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

