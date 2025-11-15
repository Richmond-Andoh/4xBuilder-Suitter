import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { PostCard } from '@/components/PostCard'
import { CreatePostModal } from '@/components/CreatePostModal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus } from 'lucide-react'
import { getPosts, type Post } from '@/lib/mockData'
import { useToast } from '@/hooks/useToast'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('foryou')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    setLoading(true)
    setTimeout(() => {
      setPosts(getPosts(activeTab as 'foryou' | 'following'))
      setLoading(false)
    }, 500)
  }, [activeTab])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
        : post
    ))
  }

  const handleReshare = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, reshared: !post.reshared, reshareCount: post.reshared ? post.reshareCount - 1 : post.reshareCount + 1 }
        : post
    ))
    toast({
      description: 'Post reshared',
    })
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ))
    toast({
      description: posts.find(p => p.id === postId)?.bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
    })
  }

  const handleCopyLink = (postId: string) => {
    toast({
      description: 'Link copied to clipboard',
    })
  }

  const handleShare = (postId: string) => {
    toast({
      description: 'Post shared',
    })
  }

  const handleMute = (userId: string) => {
    toast({
      description: 'User muted',
    })
  }

  const handleBlock = (userId: string) => {
    toast({
      description: 'User blocked',
    })
  }

  const handleReport = (postId: string) => {
    toast({
      description: 'Post reported',
    })
  }

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
    toast({
      description: 'Post deleted',
    })
  }

  const handleFollow = (userId: string) => {
    toast({
      description: 'User followed',
    })
  }

  return (
    <div className="flex flex-col">
      {/* Feed Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="foryou" className="flex-1">For You</TabsTrigger>
              <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReshare={handleReshare}
                onBookmark={handleBookmark}
                onCopyLink={handleCopyLink}
                onShare={handleShare}
                onMute={handleMute}
                onBlock={handleBlock}
                onReport={handleReport}
                onDelete={handleDelete}
                onFollow={handleFollow}
              />
            ))
          )}
        </div>
      )}

      {/* Floating Create Post Button - Fixed position, doesn't scroll */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          onClick={() => setShowCreatePost(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <CreatePostModal open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  )
}
