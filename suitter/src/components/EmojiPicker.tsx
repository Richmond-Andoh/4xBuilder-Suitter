import { useState } from 'react'
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import { Button } from './ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { cn } from '@/lib/utils'

interface EmojiPickerComponentProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerComponentProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("hover:bg-muted", className)}
        >
          <Smile className="w-5 h-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 border-none" 
        align="start" 
        side="top"
        sideOffset={8}
      >
        <EmojiPickerReact
          onEmojiClick={handleEmojiClick}
          theme={Theme.AUTO}
          width="100%"
          height={400}
          searchPlaceHolder="Search emoji..."
          previewConfig={{
            showPreview: false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

