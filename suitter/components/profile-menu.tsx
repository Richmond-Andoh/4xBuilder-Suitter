'use client'

import { useAuth } from '@/context/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export function ProfileMenu() {
  const { state, disconnectWallet, currentUser } = useAuth()

  if (!state.isConnected || !currentUser) {
    return null
  }

  const initials = currentUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-3 pb-2">
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">View Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
