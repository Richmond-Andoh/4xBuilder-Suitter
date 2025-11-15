import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSui } from '@/hooks/useSui'
import { useToast } from '@/hooks/useToast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_POST_CHARS } from '@/lib/constants'

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { currentUser } = useAuth()
  const { createPost } = useSui()
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)

  const charCount = content.length
  const isOverLimit = charCount > MAX_POST_CHARS
  const canPost = content.trim().length > 0 && !isOverLimit && !isPosting

  const handlePost = async () => {
    if (!canPost || !currentUser) return

    setIsPosting(true)
    try {
      const txDigest = await createPost(content, images)
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      })
      setContent('')
      setImages([])
      onOpenChange(false)
    } catch (error: any) {
      console.error('Failed to create post:', error)
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPosting(false)
    }
  }

  const handleClose = () => {
    if (!isPosting) {
      setContent('')
      setImages([])
      onOpenChange(false)
    }
  }

  const initials = currentUser?.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={MAX_POST_CHARS + 100} // Allow typing past limit for visual feedback
              />

              {/* Character Counter */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className={cn(
                    charCount > MAX_POST_CHARS * 0.9 && 'text-yellow-600 dark:text-yellow-400',
                    isOverLimit && 'text-destructive'
                  )}>
                    {charCount} / {MAX_POST_CHARS}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPosting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePost}
                    disabled={!canPost}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

