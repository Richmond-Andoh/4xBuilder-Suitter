'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { WalletConnectButton } from './wallet-connect-button'
import { ProfileMenu } from './profile-menu'
import { MobileNav } from './mobile-nav'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Map route to display title
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/explore': 'Explore',
  '/notifications': 'Notifications',
  '/messages': 'Messages',
  '/nft-gallery': 'NFT Gallery',
  '/bookmarks': 'Bookmarks',
  '/lists': 'Lists',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

export function TopBar() {
  const pathname = usePathname()
  const { state } = useAuth()
  const { theme, setTheme } = useTheme()
  const title = ROUTE_TITLES[pathname] || 'Suitter'

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-sm z-40 flex items-center px-4 md:px-6">
      {/* Left - Menu button and logo */}
      <div className="flex items-center gap-4">
        <MobileNav />
        <Link href="/" className="font-bold text-xl text-primary">
          S
        </Link>
      </div>

      {/* Center - Title */}
      <div className="flex-1 text-center hidden md:block">
        <h1 className="font-semibold text-lg text-foreground">
          {title}
        </h1>
      </div>

      {/* Right - Theme switcher and actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover-lift">
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {state.isConnected ? (
          <ProfileMenu />
        ) : (
          <WalletConnectButton />
        )}
      </div>
    </header>
  )
}
