'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateSuitModal } from './create-suit-modal'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

interface CreateSuitButtonProps {
  className?: string
}

export function CreateSuitButton({ className }: CreateSuitButtonProps) {
  const [open, setOpen] = useState(false)
  const { state } = useAuth()

  if (!state.isConnected) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12',
          className
        )}
      >
        Post
      </Button>
      <CreateSuitModal open={open} onOpenChange={setOpen} />
    </>
  )
}
