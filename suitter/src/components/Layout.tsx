import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ConnectButton } from '@mysten/dapp-kit'
import { Button } from './ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { CreatePostModal } from './CreatePostModal'
import { MobileNav } from './MobileNav'
import { Home, Compass, Bell, ImageIcon, Bookmark, List, User, Settings, Plus, Flame, Hash, ArrowUpRight, UserPlus, Users, Check, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockUsers } from '@/lib/mockData'
import { useToast } from '@/hooks/useToast'

interface LayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/nft-gallery', icon: ImageIcon, label: 'NFT Gallery' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/lists', icon: List, label: 'Lists' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { state } = useAuth()
  const { toast } = useToast()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  
  // Get suggested users (exclude current user if connected)
  const suggestedUsers = mockUsers
    .filter(user => !state.isConnected || user.id !== state.user?.id)
    .slice(0, 5)

  const handleFollow = (userId: string, username: string) => {
    const isFollowingUser = following.has(userId)
    
    if (isFollowingUser) {
      setFollowing(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      toast({
        description: `Unfollowed @${username}`,
      })
    } else {
      setFollowing(prev => new Set(prev).add(userId))
      toast({
        description: `Following @${username}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center gap-4 flex-1">
            <MobileNav />
          </div>

          <div className="flex items-center justify-center flex-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Suitter" 
                className="w-44 object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4 flex-1">
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar Navigation - Hidden, only accessible via hamburger menu */}
        <aside className="hidden">
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              // Handle profile and messages routes - check if path starts with the route
              const isActive = item.href === '/profile' 
                ? location.pathname.startsWith('/profile')
                : item.href === '/messages'
                ? location.pathname.startsWith('/messages')
                : location.pathname === item.href
              // Get the actual href - if profile and user is connected, use their profile
              const href = item.href === '/profile' && state.isConnected && state.user
                ? `/profile/${state.user.id}`
                : item.href
              return (
                <Link
                  key={item.href}
                  to={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {state.isConnected && (
            <Button className="mt-6 w-full" size="lg" onClick={() => setShowCreatePost(true)}>
              <Plus className="w-5 h-5" />
              Post
            </Button>
          )}
        </aside>

        <CreatePostModal open={showCreatePost} onOpenChange={setShowCreatePost} />

        {/* Main Content - Single Column, Max 600px, Centered */}
        <main className={cn(
          "flex-1 w-full min-h-[calc(100vh-4rem)]",
          location.pathname !== '/messages' && "max-w-[600px] mx-auto border-x border-border"
        )}>
          {children}
        </main>

        {/* Right Sidebar - Optional, compact widgets - Only show on home page */}
        {location.pathname === '/' && (
          <aside className="hidden lg:block w-80 border-l border-border min-h-[calc(100vh-4rem)] p-6">
            <div className="sticky top-20 space-y-6">
              {/* Trending Widget */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Trending</h3>
                  <p className="text-xs text-muted-foreground">What's hot now</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { tag: 'SuiBlockchain', posts: 12500, trend: '+12%' },
                  { tag: 'Web3', posts: 8900, trend: '+8%' },
                  { tag: 'NFT', posts: 5670, trend: '+5%' },
                  { tag: 'DeFi', posts: 4320, trend: '+3%' },
                  { tag: 'MoveLanguage', posts: 3210, trend: '+2%' },
                ].map((topic, index) => (
                  <Link
                    key={topic.tag}
                    to={`/explore?q=${topic.tag}`}
                    className={cn(
                      "group relative flex items-center gap-3 p-3 rounded-xl",
                      "hover:bg-primary/5 transition-all duration-200",
                      "border border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      index === 0 
                        ? "bg-primary text-primary-foreground" 
                        : index === 1
                        ? "bg-primary/80 text-primary-foreground"
                        : index === 2
                        ? "bg-primary/60 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-semibold text-sm truncate">#{topic.tag}</span>
                        {index < 3 && (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {topic.trend}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {topic.posts.toLocaleString()} posts
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
              <Link
                to="/explore"
                className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
              >
                Show more
              </Link>
            </div>

            {/* People You May Know Widget */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">People you may know</h3>
                  <p className="text-xs text-muted-foreground">Suggested for you</p>
                </div>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((suggestedUser) => {
                  const initials = suggestedUser.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                  
                  return (
                    <div
                      key={suggestedUser.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
                    >
                      <Link
                        to={`/profile/${suggestedUser.id}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={suggestedUser.avatar} alt={suggestedUser.displayName} />
                          <AvatarFallback className="text-xs font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-sm truncate">
                              {suggestedUser.displayName}
                            </p>
                            {suggestedUser.isVerified && (
                              <span className="text-primary text-xs">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            @{suggestedUser.username}
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant={following.has(suggestedUser.id) ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 h-8 px-3 text-xs font-semibold"
                        onClick={(e) => {
                          e.preventDefault()
                          handleFollow(suggestedUser.id, suggestedUser.username)
                        }}
                      >
                        {following.has(suggestedUser.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
              <Link
                to="/explore"
                className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
              >
                Show more
              </Link>
            </div>
          </div>
        </aside>
        )}
      </div>
    </div>
  )
}

