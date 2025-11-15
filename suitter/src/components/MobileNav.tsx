import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Home, Compass, Bell, ImageIcon, Bookmark, List, User, Settings, Menu, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>
              <Link
                to="/"
                className="flex items-center"
                onClick={() => setOpen(false)}
              >
                <img 
                  src="/logo.png" 
                  alt="Suitter" 
                  className="w-30 object-contain"
                />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = item.href === '/profile'
                  ? location.pathname.startsWith('/profile')
                  : item.href === '/messages'
                  ? location.pathname.startsWith('/messages')
                  : location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
