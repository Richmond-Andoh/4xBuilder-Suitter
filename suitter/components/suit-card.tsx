'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suit } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Repeat2, Heart, Share2, MoreHorizontal, Bookmark, Flag, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface SuitCardProps {
  suit: Suit
  onLike?: (suitId: string) => void
  onResuit?: (suitId: string) => void
  onBookmark?: (suitId: string) => void
}

export function SuitCard({ suit, onLike, onResuit, onBookmark }: SuitCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(suit.liked)
  const [likeCount, setLikeCount] = useState(suit.likeCount)
  const [isResuited, setIsResuited] = useState(false)
  const [resuitCount, setResuitCount] = useState(suit.resuitCount)
  const [isBookmarked, setIsBookmarked] = useState(suit.bookmarked)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [comment, setComment] = useState('')
  const [reportReason, setReportReason] = useState('')
  const [copied, setCopied] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.(suit.id)
    
    if (!isLiked) {
      toast({
        description: 'Suit liked',
      })
    }
  }

  const handleResuit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResuited(!isResuited)
    setResuitCount(isResuited ? resuitCount - 1 : resuitCount + 1)
    onResuit?.(suit.id)
    
    toast({
      description: isResuited ? 'Resuit removed' : 'Resuited to your profile',
    })
  }

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowCommentDialog(true)
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      toast({
        description: 'Comment posted successfully',
      })
      setComment('')
      setShowCommentDialog(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/suit/${suit.id}`
    
    if (navigator.share) {
      navigator.share({
        title: `Suit by ${suit.author.displayName}`,
        text: suit.content,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      toast({
        description: 'Link copied to clipboard',
      })
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/suit/${suit.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      description: 'Link copied to clipboard',
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(suit.id)
    toast({
      description: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
    })
  }

  const handleReport = () => {
    setShowReportDialog(true)
  }

  const handleSubmitReport = () => {
    if (reportReason.trim()) {
      toast({
        description: 'Report submitted. We\'ll review this content.',
      })
      setReportReason('')
      setShowReportDialog(false)
    }
  }

  const initials = suit.author.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <>
      <article className="glass-effect border border-border rounded-lg p-6 hover-lift group">
        <div className="flex gap-4">
          <Link href={`/profile/${suit.author.id}`}>
            <Avatar className="w-12 h-12 ring-2 ring-border hover:ring-primary transition-all">
              <AvatarImage src={suit.author.avatar || "/placeholder.svg"} alt={suit.author.displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Header with user info */}
            <div className="flex items-start justify-between mb-3">
              <Link href={`/profile/${suit.author.id}`} className="flex gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-tight truncate">
                    {suit.author.displayName}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">
                    @{suit.author.username}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(suit.createdAt), { addSuffix: true })}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyLink}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBookmark}>
                      <Bookmark className={cn("w-4 h-4 mr-2", isBookmarked && "fill-current")} />
                      {isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReport} className="text-destructive focus:text-destructive">
                      <Flag className="w-4 h-4 mr-2" />
                      Report Suit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <Link href={`/suit/${suit.id}`}>
              <p className="text-base text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
                {suit.content}
              </p>
            </Link>

            {suit.images.length > 0 && (
              <div className={cn(
                'mt-3 rounded-lg overflow-hidden border border-border',
                suit.images.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2'
              )}>
                {suit.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image || "/placeholder.svg"}
                    alt={`Suit image ${idx + 1}`}
                    className="w-full h-auto bg-muted object-cover"
                  />
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex items-center justify-between text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                onClick={handleComment}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{suit.commentCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex items-center gap-2 rounded-full transition-colors',
                  isResuited
                    ? 'text-green-600 dark:text-green-400 bg-green-500/10'
                    : 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10'
                )}
                onClick={handleResuit}
              >
                <Repeat2 className="w-4 h-4" />
                <span className="text-sm">{resuitCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex items-center gap-2 rounded-full transition-colors',
                  isLiked
                    ? 'text-red-600 dark:text-red-400 bg-red-500/10'
                    : 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10'
                )}
                onClick={handleLike}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                <span className="text-sm">{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {suit.author.displayName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={suit.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">{suit.content.slice(0, 100)}...</p>
            </div>
            <Textarea
              placeholder="Post your reply..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Suit</DialogTitle>
            <DialogDescription>
              Help us understand what's wrong with this suit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Please describe why you're reporting this suit..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReport} 
                disabled={!reportReason.trim()}
                variant="destructive"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
