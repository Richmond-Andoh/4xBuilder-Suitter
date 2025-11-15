'use client'

import Link from 'next/link'
import { Notification } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Repeat2, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const initials = notification.sender.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  const getIcon = () => {
    switch (notification.type) {
      case 'follow':
        return <UserPlus className="w-5 h-5 text-primary" />
      case 'like':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />
      case 'resuit':
        return <Repeat2 className="w-5 h-5 text-green-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-primary" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  return (
    <Link
      href={notification.targetSuitId ? `/suit/${notification.targetSuitId}` : `/profile/${notification.senderId}`}
      className={cn(
        'block p-4 border-b border-border hover:bg-secondary transition-colors',
        !notification.read && 'bg-primary/5'
      )}
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <Avatar>
            <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{notification.sender.displayName}</p>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
            </div>
            <div className="flex-shrink-0">{getIcon()}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
