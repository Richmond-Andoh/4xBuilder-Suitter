import { useState, useEffect } from 'react'
import { useConnectWallet, useWallets } from "@mysten/dapp-kit"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog'
import { Button } from './ui/Button'
import { Wallet, Loader2, AlertCircle, Check } from 'lucide-react'

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { mutate: connect } = useConnectWallet()
  const { wallets, currentWallet } = useWallets()
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setConnectingWalletId(null)
  }, [open])

  const handleConnect = async (walletName: string) => {
    setConnectingWalletId(walletName)
    setError(null)
    
    try {
      if (!wallets || wallets.length === 0) {
        setError('No wallets available')
        setConnectingWalletId(null)
        return
      }
      
      const wallet = wallets.find(w => w.name === walletName)
      if (!wallet) {
        setError(`Wallet ${walletName} not found`)
        setConnectingWalletId(null)
        return
      }

      connect(
        { wallet },
        {
          onSuccess: () => {
            onOpenChange(false)
            setConnectingWalletId(null)
          },
          onError: (err) => {
            setError(err.message || `Failed to connect ${walletName}`)
            setConnectingWalletId(null)
          }
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to connect ${walletName}`)
      setConnectingWalletId(null)
    }
  }

  const availableWallets = wallets?.filter(w => w.installed) || []
  const isConnected = currentWallet !== null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isConnected 
              ? 'Switch to a different wallet' 
              : 'Choose a wallet to connect to Suitter'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => {
              const isConnecting = connectingWalletId === wallet.name
              const isCurrentWallet = currentWallet?.name === wallet.name
              
              return (
                <Button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={isConnecting || isCurrentWallet}
                  className="w-full h-16 flex items-center justify-between px-6"
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {wallet.icon ? (
                        <img 
                          src={wallet.icon} 
                          alt={wallet.name}
                          className="w-6 h-6"
                        />
                      ) : (
                        <Wallet className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{wallet.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isCurrentWallet ? 'Currently connected' : 'Click to connect'}
                      </p>
                    </div>
                  </div>
                  {isConnecting ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : isCurrentWallet ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-success" />
                  )}
                </Button>
              )
            })
          ) : (
            <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">No wallets detected</p>
              <p className="text-xs text-muted-foreground">
                Please install a Sui wallet extension to continue
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {availableWallets.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Popular wallets:{' '}
                <a
                  href="https://sui.io/wallets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  View all Sui wallets
                </a>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

