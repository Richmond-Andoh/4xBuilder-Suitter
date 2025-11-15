import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Button } from './ui/Button'
import { User } from '@/lib/types'
import { mockUsers } from '@/lib/mockData'

export function WhoToFollow() {
  const [following, setFollowing] = useState<Set<string>>(new Set())

  const handleFollow = (userId: string) => {
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  const suggestions = mockUsers.slice(0, 3)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Who to Follow</h3>
      <div className="space-y-4">
        {suggestions.map((user) => {
          const isFollowing = following.has(user.id)
          const initials = user.displayName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

          return (
            <div key={user.id} className="flex items-center justify-between">
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.displayName}</div>
                  <div className="text-sm text-muted-foreground truncate">@{user.username}</div>
                </div>
              </Link>
              <Button
                size="sm"
                variant={isFollowing ? 'outline' : 'default'}
                onClick={(e) => {
                  e.preventDefault()
                  handleFollow(user.id)
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

