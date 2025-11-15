'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TabType = 'for-you' | 'following'

interface FeedTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'for-you', label: 'For You' },
    { id: 'following', label: 'Following' },
  ]

  return (
    <div className="sticky top-16 border-b border-border bg-background/80 backdrop-blur-sm z-30">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 py-4 font-semibold transition-all relative',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-secondary/30'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
