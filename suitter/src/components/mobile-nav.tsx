'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Home, Compass, Bell, Mail, ImageIcon, Bookmark, List, User, Settings, Menu } from 'lucide-react'
import { cn } from '../lib/utils'
import { CreateSuitButton } from './create-suit-button'

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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { state } = useAuth()

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
                className="text-2xl font-bold flex items-center gap-3"
                onClick={() => setOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  S
                </div>
                <span className="text-foreground">uitter</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-1 min-w-6 text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t">
            <CreateSuitButton className="w-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
