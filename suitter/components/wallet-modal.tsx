'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2 } from 'lucide-react'

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { connectWallet } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectSlush = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      // Check if Slush wallet is installed
      if (typeof window !== 'undefined' && (window as any).slushWallet) {
        await connectWallet()
        onOpenChange(false)
      } else {
        setError('Slush wallet not found. Please install it from Chrome Web Store.')
        // Open Slush wallet installation page
        window.open('https://chromewebstore.google.com/detail/slush-wallet/fghblonjoeaihdedkjeknopnlffdbgob', '_blank')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect your Slush wallet to continue
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Button
            onClick={handleConnectSlush}
            disabled={isConnecting}
            className="w-full h-16 flex items-center justify-between px-6 hover-lift"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Slush Wallet</p>
                <p className="text-xs text-muted-foreground">Connect to Sui network</p>
              </div>
            </div>
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </Button>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Don't have Slush wallet?{' '}
              <a
                href="https://chromewebstore.google.com/detail/slush-wallet/fghblonjoeaihdedkjeknopnlffdbgob"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Install here
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
