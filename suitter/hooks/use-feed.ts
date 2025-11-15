'use client'

import { useState, useCallback } from 'react'
import { Suit } from '@/lib/types'
import { mockSuits } from '@/lib/mock-data'

type FeedTab = 'for-you' | 'following'

export function useFeed() {
  const [suits, setSuits] = useState<Suit[]>(mockSuits)
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you')
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = useCallback((suitId: string) => {
    setSuits((prev) =>
      prev.map((suit) =>
        suit.id === suitId ? { ...suit, liked: !suit.liked } : suit
      )
    )
  }, [])

  const handleResuit = useCallback((suitId: string) => {
    // Handle resuit logic
  }, [])

  const handleBookmark = useCallback((suitId: string) => {
    // Handle bookmark logic
  }, [])

  const handleTabChange = useCallback((tab: FeedTab) => {
    setActiveTab(tab)
    // In production, fetch different suits based on tab
  }, [])

  return {
    suits,
    activeTab,
    isLoading,
    handleLike,
    handleResuit,
    handleBookmark,
    handleTabChange,
  }
}
