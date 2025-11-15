import { Button } from '@/components/ui/Button'
import { Gamepad2, ExternalLink } from 'lucide-react'

export default function NFTGalleryPage() {
  const handlePlayGame = () => {
    window.open('https://switter-five.vercel.app/', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NFT Gallery</h1>
            <p className="text-sm text-muted-foreground">Play mini-games and explore NFTs</p>
          </div>
          <Button
            onClick={handlePlayGame}
            size="lg"
            className="gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            Play Game
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Ready to Play?</h2>
            <p className="text-muted-foreground mb-6">
              Experience our mini-game collection. Click the button to launch the game in a new tab for the best experience!
            </p>
            <Button
              onClick={handlePlayGame}
              size="lg"
              className="gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Launch Game
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
