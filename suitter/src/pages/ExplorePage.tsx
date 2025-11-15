import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { PostCard } from '@/components/PostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, TrendingUp, Hash, Flame, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPosts, mockUsers, type Post, type User } from '@/lib/mockData'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ posts: Post[]; users: User[] }>({ posts: [], users: [] })
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([])
  const [trendingTopics, setTrendingTopics] = useState<Array<{ name: string; posts: number }>>([
    { name: 'Sui', posts: 12500 },
    { name: 'Web3', posts: 8900 },
    { name: 'NFT', posts: 5670 },
    { name: 'DeFi', posts: 4320 },
    { name: 'Blockchain', posts: 3210 },
  ])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true)
      // Simulate search
      setTimeout(() => {
        const posts = getPosts().filter(p => 
          p.content.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        const users = mockUsers.filter(u => 
          u.displayName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          u.username.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        setSearchResults({ posts, users })
        setLoading(false)
      }, 300)
    } else {
      setSearchResults({ posts: [], users: [] })
    }
  }, [debouncedSearch])

  useEffect(() => {
    // Load trending posts
    setTrendingPosts(getPosts().sort((a, b) => b.likeCount - a.likeCount).slice(0, 5))
  }, [])

  return (
    <div className="flex flex-col">
      {/* Search Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {searchQuery ? (
          /* Search Results */
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                {searchResults.users.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">People</h2>
                    <div className="space-y-4">
                      {searchResults.users.map(user => (
                        <Link
                          key={user.id}
                          to={`/profile/${user.id}`}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{user.displayName}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                          <Button variant="outline" size="sm">Follow</Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.posts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Posts</h2>
                    <div className="space-y-4">
                      {searchResults.posts.map(post => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {!loading && searchResults.posts.length === 0 && searchResults.users.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Trending Content */
          <div className="space-y-8">
            {/* Trending Topics */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Trending Topics</h2>
                  <p className="text-sm text-muted-foreground">What's happening right now</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {trendingTopics.map((topic, index) => (
                  <Link
                    key={topic.name}
                    to={`/explore?q=${encodeURIComponent(topic.name)}`}
                    className="group relative p-4 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-semibold text-foreground truncate">{topic.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {topic.posts.toLocaleString()} posts
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Posts */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Trending Now</h2>
                  <p className="text-sm text-muted-foreground">Most liked posts right now</p>
                </div>
              </div>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <div key={post.id} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-3 -left-3 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg">
                          <Flame className="w-3 h-3" />
                          HOT
                        </div>
                      </div>
                    )}
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
