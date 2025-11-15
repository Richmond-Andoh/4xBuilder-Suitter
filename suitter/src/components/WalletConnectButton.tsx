import { useState } from 'react'
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit"
import { Button } from './ui/Button'
import { WalletModal } from './WalletModal'
import { ChevronDown, LogOut, Copy, ExternalLink, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'
import { truncateAddress } from '@/lib/utils'

export function WalletConnectButton() {
  const account = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const [copied, setCopied] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!account) {
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

  const displayAddress = account.address
    ? truncateAddress(account.address, 6, 4)
    : 'Connected'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="font-mono text-sm">{displayAddress}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
          <p className="text-xs font-mono text-foreground truncate">{account.address}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://suiscan.xyz/testnet/account/${account.address}`, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

