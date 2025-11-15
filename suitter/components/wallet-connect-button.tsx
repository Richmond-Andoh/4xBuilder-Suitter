'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalletModal } from './wallet-modal'

export function WalletConnectButton() {
  const { state, disconnectWallet } = useAuth()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    if (state.address) {
      navigator.clipboard.writeText(state.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!state.isConnected) {
    return (
      <>
        <Button
          onClick={() => setShowWalletModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Connect Wallet
        </Button>
        <WalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
      </>
    )
  }

  const displayAddress =
    state.address
      ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
      : 'Connected'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 hover-lift">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-sm">{displayAddress}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
          <p className="text-xs font-mono text-foreground truncate">{state.address}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://suiexplorer.com/address/${state.address}`, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
