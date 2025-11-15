import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from './ui/Input'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { User, Post } from '@/lib/types'
import { mockUsers, mockPosts } from '@/lib/mockData'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ users: User[]; posts: Post[] }>({ users: [], posts: [] })
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()

  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Simple search - in production, this would query the blockchain
      const users = mockUsers.filter(
        (u) =>
          u.displayName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      const posts = mockPosts.filter((p) =>
        p.content.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      setResults({ users, posts })
      setShowResults(true)
    } else {
      setResults({ users: [], posts: [] })
      setShowResults(false)
    }
  }, [debouncedQuery])

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`)
    setQuery('')
    setShowResults(false)
  }

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search people, posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setShowResults(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {showResults && (results.users.length > 0 || results.posts.length > 0) && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-background shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.users.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                People
              </div>
              {results.users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-full hover:bg-muted transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{user.displayName}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.posts.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Posts
              </div>
              {results.posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="w-full text-left px-3 py-2 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="text-sm font-medium mb-1">{post.author.displayName}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {post.content}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

