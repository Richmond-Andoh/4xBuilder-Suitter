import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Heart, Repeat2, MessageCircle, UserPlus, AtSign, Link as LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { getNotifications, type Notification } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return Heart
    case 'reshare':
      return Repeat2
    case 'reply':
      return MessageCircle
    case 'follow':
      return UserPlus
    case 'mention':
      return AtSign
    default:
      return LinkIcon
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setNotifications(getNotifications())
      setLoading(false)
    }, 500)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const link = notification.targetPostId 
              ? `/post/${notification.targetPostId}`
              : `/profile/${notification.sender.id}`

            return (
              <Link
                key={notification.id}
                to={link}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  'flex gap-4 p-6 hover:bg-muted/50 transition-colors',
                  !notification.read && 'bg-muted/30'
                )}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={notification.sender.avatar} />
                  <AvatarFallback>{notification.sender.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Icon className={cn(
                      'w-5 h-5 mt-0.5 flex-shrink-0',
                      notification.type === 'like' && 'text-foreground',
                      notification.type === 'reshare' && 'text-foreground',
                      notification.type === 'follow' && 'text-foreground'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.sender.displayName}</span>{' '}
                        <span className="text-muted-foreground">{notification.message}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
