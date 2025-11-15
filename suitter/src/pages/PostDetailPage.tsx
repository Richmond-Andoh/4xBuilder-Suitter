import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PostCard } from '@/components/PostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getPostById, type Post, type Reply } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function PostDetailPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const foundPost = getPostById(id)
        setPost(foundPost || null)
        // Mock replies
        if (foundPost) {
          setReplies([
            {
              id: '1',
              postId: id,
              authorId: '2',
              author: {
                id: '2',
                address: '0xabcdef',
                username: 'bob_dev',
                displayName: 'Bob Developer',
                bio: 'Developer',
                avatar: '/placeholder-user.jpg',
                banner: '/placeholder.jpg',
                joinedAt: new Date(),
                followersCount: 100,
                followingCount: 50,
              },
              content: 'Great post! Really insightful.',
              images: [],
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              likeCount: 5,
              liked: false,
              replies: [],
            },
          ])
        }
        setLoading(false)
      }, 500)
    }
  }, [id])

  const handleReply = () => {
    if (!replyContent.trim() || !currentUser || !post) return

    const newReply: Reply = {
      id: Date.now().toString(),
      postId: post.id,
      authorId: currentUser.id,
      author: currentUser,
      content: replyContent,
      images: [],
      createdAt: new Date(),
      likeCount: 0,
      liked: false,
      replies: [],
    }

    setReplies([newReply, ...replies])
    setReplyContent('')
    setPost({ ...post, replyCount: post.replyCount + 1 })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Post not found</p>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Post */}
      <div className="border-b border-border">
        <PostCard post={post} />
      </div>

      {/* Reply Composer */}
      {currentUser && (
        <div className="p-6 border-b border-border">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Post your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  size="sm"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      <div className="divide-y divide-border">
        {replies.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          replies.map(reply => (
            <div key={reply.id} className="p-6">
              <div className="flex gap-4">
                <Link to={`/profile/${reply.author.id}`}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={reply.author.avatar} />
                    <AvatarFallback>{reply.author.displayName[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${reply.author.id}`} className="font-semibold hover:underline">
                      {reply.author.displayName}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      @{reply.author.username}
                    </span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{reply.content}</p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Heart className={cn('w-4 h-4', reply.liked && 'fill-current')} />
                      <span className="ml-1 text-xs">{reply.likeCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
