'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Compass, Bell, Mail, ImageIcon, Bookmark, List, User, Settings, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateSuitButton } from './create-suit-button'
import { ProfileMenu } from './profile-menu'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home', badge: null },
  { href: '/explore', icon: Compass, label: 'Explore', badge: null },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: 3 },
  { href: '/messages', icon: Mail, label: 'Messages', badge: 1 },
  { href: '/nft-gallery', icon: ImageIcon, label: 'NFT Gallery', badge: null },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks', badge: null },
  { href: '/lists', icon: List, label: 'Lists', badge: null },
  { href: '/profile', icon: User, label: 'Profile', badge: null },
  { href: '/settings', icon: Settings, label: 'Settings', badge: null },
]

export function Sidebar() {
  const pathname = usePathname()
  const { state } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-primary/20 bg-background/50 backdrop-blur-md flex-col p-6 overflow-y-auto hidden z-50">
      <Link
        href="/"
        className="text-2xl font-bold mb-12 flex items-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold neon-glow animate-pulse-glow group-hover:scale-110 transition-transform">
          S
        </div>
        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-rotate-gradient">
          uitter
        </span>
      </Link>

      {/* Navigation with creative animations */}
      <nav className="space-y-3 flex-1">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-5 py-3 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'glass-effect border-2 border-primary/40 text-primary shadow-lg shadow-primary/20'
                  : 'text-foreground/80 hover:text-foreground hover:bg-secondary/20 hover:border-primary/20'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 text-foreground/60 group-hover:bg-primary/30 group-hover:text-primary'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </div>
              
              {item.badge && (
                <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold rounded-full px-2.5 py-1 flex items-center justify-center min-w-6 animate-pulse-glow relative z-10">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mb-6">
        <CreateSuitButton className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105" />
      </div>

      {/* Profile Section with glassmorphism */}
      {state.isConnected && (
        <div className="border-t border-primary/20 pt-4 glass-effect rounded-xl p-4">
          <div className="flex items-center justify-between">
            <ProfileMenu />
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/20 hover:text-primary transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
