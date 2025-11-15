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
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const POSTS_PER_PAGE = 20

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
  const loadPosts = useCallback(async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
        setOffset(0)
        setHasMore(true)
        setError(null)
      }

      const currentOffset = reset ? 0 : offset

      if (activeTab === 'following') {
        // Get posts from users being followed
        const followedUserIds = Array.from(following)

        if (followedUserIds.length === 0) {
          setPosts([])
          setLoading(false)
          setHasMore(false)
          return
        }

        // Fetch posts from all followed users
        const allPosts: Post[] = []

        for (const userId of followedUserIds) {
          try {
            const userPosts = await getPostsByAuthor(userId, POSTS_PER_PAGE, currentOffset)
            allPosts.push(...userPosts)
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error)
          }
        }

        // Sort by creation date (newest first) and remove duplicates
        const uniquePosts = Array.from(
          new Map(allPosts.map(post => [post.id, post])).values()
        )
        uniquePosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        if (reset) {
          setPosts(uniquePosts)
        } else {
          setPosts(prevPosts => {
            const merged = [...prevPosts, ...uniquePosts]
            return Array.from(new Map(merged.map(post => [post.id, post])).values())
          })
        }

        setHasMore(uniquePosts.length === POSTS_PER_PAGE)
        setOffset(currentOffset + 1)
      } else {
        // Get all posts for "For You" feed
        const newPosts = await getPosts(POSTS_PER_PAGE, currentOffset)

        if (reset) {
          setPosts(newPosts)
        } else {
          // Merge with existing posts and remove duplicates
          setPosts(prevPosts => {
            const merged = [...prevPosts, ...newPosts]
            return Array.from(new Map(merged.map(post => [post.id, post])).values())
          })
        }

        // Check if there are more posts
        setHasMore(newPosts.length === POSTS_PER_PAGE)
        setOffset(currentOffset + 1)
      }
    } catch (error: any) {
      console.error('Error loading posts:', error)
      setError(error?.message || 'Failed to load posts')
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load posts. Please try again.',
        variant: 'destructive',
      })
      if (reset) {
        setPosts([])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeTab, following, getPosts, getPostsByAuthor, toast, offset])

  // Load posts on mount and when tab/following changes
  useEffect(() => {
    loadPosts(true) // Reset and reload when tab or following changes
  }, [activeTab, following, loadPosts]) // Include loadPosts but it's stable due to useCallback

  // Separate effect to reload posts when modal closes (for new posts)
  useEffect(() => {
    if (!showCreatePost) {
      // Small delay to ensure transaction is indexed
      const timer = setTimeout(() => {
        loadPosts(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showCreatePost, loadPosts])

  // Refresh posts
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPosts(true)
    toast({
      description: 'Posts refreshed',
    })
  }

  // Load more posts (for pagination/infinite scroll)
  const loadMorePosts = useCallback(async () => {
    if (!loading && hasMore) {
      await loadPosts(false)
    }
  }, [loading, hasMore, loadPosts])

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
          {error && (
            <div className="p-6 text-center border-b border-border">
              <p className="text-destructive mb-2">Error loading posts</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {posts.length === 0 && !error ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-muted-foreground/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'following'
                    ? following.size === 0
                      ? "You're not following anyone yet"
                      : "No posts from people you're following yet"
                    : "No posts yet"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'following'
                    ? following.size === 0
                      ? "Follow some users to see their posts here!"
                      : "Posts from people you follow will appear here."
                    : "Be the first to post and share your thoughts with the community!"}
                </p>
                {state.isConnected && activeTab === 'foryou' && (
                  <Button onClick={() => setShowCreatePost(true)} size="lg">
                    Create Your First Post
                  </Button>
                )}
                {!state.isConnected && (
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to start posting and interacting with the community.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {posts.map((post) => (
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
              ))}

              {/* Load More Button */}
              {hasMore && posts.length > 0 && (
                <div className="p-6 text-center border-t border-border">
                  <Button
                    onClick={loadMorePosts}
                    disabled={loading || refreshing}
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Posts'
                    )}
                  </Button>
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className="p-6 text-center border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    You've reached the end of the feed
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating Create Post Button - Fixed position, doesn't scroll */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          onClick={() => setShowCreatePost(true)}
        // disabled={!state.isConnected}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <CreatePostModal
        open={showCreatePost}
        onOpenChange={(open) => {
          setShowCreatePost(open)
        }}
      />
    </div>
  )
}
