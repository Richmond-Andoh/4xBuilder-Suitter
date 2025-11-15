import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { PostCard } from '@/components/PostCard'
import { CreatePostModal } from '@/components/CreatePostModal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus, RefreshCw } from 'lucide-react'
import { Post } from '@/lib/types'
import { useToast } from '@/hooks/useToast'
import { useSui } from '@/hooks/useSui'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('foryou')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { getPosts, getPostsByAuthor, likePost } = useSui()
  const { state } = useAuth()

  // Load following state from localStorage on mount and when tab changes
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
  }, [activeTab])

  // Save following state to localStorage whenever it changes
  useEffect(() => {
    if (following.size > 0) {
      localStorage.setItem('suitter_following', JSON.stringify(Array.from(following)))
    } else {
      localStorage.removeItem('suitter_following')
    }
  }, [following])

  // Fetch posts from blockchain
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'following') {
        // Get posts from users being followed
        const followedUserIds = Array.from(following)
        
        if (followedUserIds.length === 0) {
          setPosts([])
          setLoading(false)
          return
        }

        // Fetch posts from all followed users
        const allPosts: Post[] = []
        for (const userId of followedUserIds) {
          try {
            const userPosts = await getPostsByAuthor(userId, 20, 0)
            allPosts.push(...userPosts)
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error)
          }
        }

        // Sort by creation date (newest first)
        allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        setPosts(allPosts)
      } else {
        // Get all posts for "For You" feed
        const allPosts = await getPosts(20, 0)
        setPosts(allPosts)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load posts. Please try again.',
        variant: 'destructive',
      })
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, following, getPosts, getPostsByAuthor, toast])

  // Load posts on mount and when tab/following changes
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Refresh posts
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
    toast({
      description: 'Posts refreshed',
    })
  }

  const handleLike = async (postId: string) => {
    try {
      // Optimistically update UI
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      ))

      // Call blockchain
      await likePost(postId)
      
      toast({
        description: 'Post liked',
      })
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert optimistic update
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      ))
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive',
      })
    }
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

  const handleCopyLink = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
      toast({
        description: 'Link copied to clipboard',
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast({
        description: 'Failed to copy link',
        variant: 'destructive',
      })
    }
  }

  const handleShare = () => {
    toast({
      description: 'Post shared',
    })
  }

  const handleMute = () => {
    toast({
      description: 'User muted',
    })
  }

  const handleBlock = () => {
    toast({
      description: 'User blocked',
    })
  }

  const handleReport = () => {
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
    const isFollowingUser = following.has(userId)
    
    if (isFollowingUser) {
      setFollowing(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      toast({
        description: 'User unfollowed',
      })
    } else {
      setFollowing(prev => new Set(prev).add(userId))
      toast({
        description: 'User followed',
      })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Feed Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="foryou" className="flex-1">For You</TabsTrigger>
                <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="ml-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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
              <p className="text-muted-foreground mb-4">
                {activeTab === 'following' 
                  ? following.size === 0
                    ? "You're not following anyone yet. Follow some users to see their posts here!"
                    : "No posts from people you're following yet."
                  : "No posts yet. Be the first to post!"}
              </p>
              {!state.isConnected && (
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to start posting and interacting with the community.
                </p>
              )}
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
          disabled={!state.isConnected}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <CreatePostModal 
        open={showCreatePost} 
        onOpenChange={(open) => {
          setShowCreatePost(open)
          if (!open) {
            // Refresh posts when modal closes (in case a post was created)
            loadPosts()
          }
        }} 
      />
    </div>
  )
}
