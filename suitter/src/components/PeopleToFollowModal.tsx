import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Button } from './ui/Button'
import { ChevronLeft, ChevronRight, UserPlus, Check, Verified } from 'lucide-react'
import { User } from '@/lib/types'
import { mockUsers } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

interface PeopleToFollowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const USERS_PER_PAGE = 3

export function PeopleToFollowModal({ open, onOpenChange }: PeopleToFollowModalProps) {
  const { state } = useAuth()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Load following state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('suitter_following')
    if (stored) {
      try {
        const followingArray = JSON.parse(stored)
        setFollowing(new Set(followingArray))
      } catch (error) {
        console.error('Failed to parse following state:', error)
      }
    }
  }, [])

  // Save following state to localStorage whenever it changes
  useEffect(() => {
    if (following.size > 0) {
      localStorage.setItem('suitter_following', JSON.stringify(Array.from(following)))
    } else {
      localStorage.removeItem('suitter_following')
    }
  }, [following])

  // Get all suggested users (exclude current user if connected)
  const allSuggestedUsers = mockUsers
    .filter(user => !state.isConnected || user.id !== state.user?.id)

  const totalPages = Math.ceil(allSuggestedUsers.length / USERS_PER_PAGE)
  const startIndex = currentPage * USERS_PER_PAGE
  const endIndex = startIndex + USERS_PER_PAGE
  const currentUsers = allSuggestedUsers.slice(startIndex, endIndex)

  const handleFollow = (userId: string, username: string) => {
    const isFollowingUser = following.has(userId)
    
    if (isFollowingUser) {
      setFollowing(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      toast({
        description: `Unfollowed @${username}`,
      })
    } else {
      setFollowing(prev => new Set(prev).add(userId))
      toast({
        description: `Following @${username}`,
      })
    }
  }

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }

  // Swipe gesture handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentPage < totalPages - 1) {
      handleNext()
    }
    if (isRightSwipe && currentPage > 0) {
      handlePrevious()
    }
  }

  // Reset to first page when modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>People you may know</DialogTitle>
          <DialogDescription>
            Discover and follow interesting people
          </DialogDescription>
        </DialogHeader>

        <div 
          className="relative mt-6"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full shadow-lg",
                  currentPage === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full shadow-lg",
                  currentPage === totalPages - 1 && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Users List */}
          <div className="space-y-4 min-h-[300px]">
            {currentUsers.map((user) => {
              const initials = user.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              
              const isFollowingUser = following.has(user.id)

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-all"
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                    onClick={() => onOpenChange(false)}
                  >
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback className="text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-base truncate">
                          {user.displayName}
                        </p>
                        {user.isVerified && (
                          <Verified className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{user.followersCount.toLocaleString()} followers</span>
                        <span>{user.followingCount.toLocaleString()} following</span>
                      </div>
                    </div>
                  </Link>
                  <Button
                    variant={isFollowingUser ? 'outline' : 'default'}
                    size="sm"
                    className="flex-shrink-0 h-9 px-4 font-semibold"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFollow(user.id, user.username)
                    }}
                  >
                    {isFollowingUser ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Page Indicator */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentPage
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Swipe Hint */}
          {totalPages > 1 && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Swipe left or right to see more people
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

