'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, UserPlus } from 'lucide-react'

export function WhoToFollow() {
  const { currentUser } = useAuth()
  const [following, setFollowing] = useState<Set<string>>(new Set())

  // Mock users for demo
  const SUGGESTED_USERS = [
    { id: '2', username: 'alice_dev', displayName: 'Alice Developer', avatar: '/alice-in-wonderland.png' },
    { id: '3', username: 'bob_crypto', displayName: 'Bob Crypto', avatar: '/bob-portrait.png' },
    { id: '4', username: 'carol_nft', displayName: 'Carol NFT', avatar: '/festive-carol-scene.png' },
  ]

  const handleFollow = (userId: string) => {
    setFollowing((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const initials = (displayName: string) =>
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')

  return (
    <div className="glass-effect border-2 border-secondary/20 rounded-2xl p-6 neon-glow-blue">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-lg animate-pulse-glow">
          <Users className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Who to Follow
        </h2>
      </div>

      {/* Users list with creative cards */}
      <div className="space-y-3">
        {SUGGESTED_USERS.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 glass-effect border border-secondary/20 rounded-xl hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300 group animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link href={`/profile/${user.id}`} className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-secondary/30 group-hover:ring-secondary/60 transition-all">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-white">
                    {initials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-background animate-pulse"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </Link>

            <Button
              size="sm"
              className={following.has(user.id) 
                ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' 
                : 'bg-gradient-to-r from-secondary to-primary text-white hover:shadow-lg hover:shadow-secondary/50 hover:scale-105'
              }
              onClick={() => handleFollow(user.id)}
            >
              {following.has(user.id) ? (
                'Following'
              ) : (
                <span className="flex items-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  Follow
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
