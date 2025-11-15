'use client'

import { Conversation } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface MessageItemProps {
  conversation: Conversation
  isActive?: boolean
}

export function MessageItem({ conversation, isActive }: MessageItemProps) {
  const otherUser = conversation.participants[1]
  const initials = otherUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <button
      className={cn(
        'w-full p-4 border-b border-border hover:bg-secondary transition-colors text-left',
        isActive && 'bg-primary/10'
      )}
    >
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="font-semibold">{otherUser.displayName}</p>
            <p className="text-xs text-muted-foreground flex-shrink-0">
              {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage.content}
          </p>
        </div>

        {conversation.unreadCount > 0 && (
          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" />
        )}
      </div>
    </button>
  )
}
