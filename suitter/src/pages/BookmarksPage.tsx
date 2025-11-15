import { useState, useEffect } from 'react'
import { PostCard } from '@/components/PostCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Bookmark } from 'lucide-react'
import { getBookmarkedPosts, type Post } from '@/lib/mockData'

export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setPosts(getBookmarkedPosts())
      setLoading(false)
    }, 500)
  }, [])

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
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-6">
        <div className="flex items-center gap-3">
          <Bookmark className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Bookmarks</h1>
        </div>
      </div>

      {/* Posts */}
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
      ) : posts.length === 0 ? (
        <div className="p-12 text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No bookmarked posts yet</p>
          <p className="text-sm text-muted-foreground mt-2">Posts you bookmark will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onReshare={handleReshare}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
