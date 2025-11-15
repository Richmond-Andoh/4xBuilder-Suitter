'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProfileTab = 'suits' | 'replies' | 'media' | 'likes'

interface ProfileTabsProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: 'suits', label: 'Suits' },
    { id: 'replies', label: 'Replies' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' },
  ]

  return (
    <div className="border-b border-border sticky top-16 bg-background/80 backdrop-blur-sm z-30 flex">
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
  )
}
