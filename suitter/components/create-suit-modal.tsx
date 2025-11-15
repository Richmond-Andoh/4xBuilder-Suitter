'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImagePlus, Smile, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateSuitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSuitModal({ open, onOpenChange }: CreateSuitModalProps) {
  const { currentUser } = useAuth()
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const charCount = content.length
  const maxChars = 280
  const charColor =
    charCount > maxChars ? 'text-destructive' : charCount > 260 ? 'text-yellow-500' : 'text-muted-foreground'

  const handlePost = async () => {
    if (!content.trim() || content.length > maxChars) return

    setIsPosting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setContent('')
      onOpenChange(false)
    } finally {
      setIsPosting(false)
    }
  }

  if (!currentUser) return null

  const initials = currentUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-effect border-2 border-primary/30">
        <DialogHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 -m-6 mb-0 p-6 rounded-t-xl border-b border-primary/20">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="w-5 h-5 text-primary" />
            Create a new Suit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* User info with avatar ring */}
          <div className="flex gap-4">
            <Avatar className="w-14 h-14 flex-shrink-0 ring-2 ring-primary/30">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{currentUser.displayName}</p>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?!"
              className="w-full text-2xl font-light bg-secondary/20 text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none p-4 rounded-xl border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
              rows={4}
            />
            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-5 bg-gradient-to-r from-primary via-transparent to-secondary transition-opacity pointer-events-none"></div>
          </div>

          {/* Toolbar with creative icons */}
          <div className="flex items-center justify-between border-t border-primary/20 pt-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/20 hover:scale-110 transition-all rounded-lg"
              >
                <ImagePlus className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-secondary hover:bg-secondary/20 hover:scale-110 transition-all rounded-lg"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            {/* Character count and post button */}
            <div className="flex items-center gap-4">
              <span className={cn('text-sm font-semibold', charColor)}>
                {charCount}/{maxChars}
              </span>
              <Button
                onClick={handlePost}
                disabled={!content.trim() || charCount > maxChars || isPosting}
                className="rounded-full px-8 font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
              >
                {isPosting ? (
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 animate-spin" />
                    Posting...
                  </span>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
