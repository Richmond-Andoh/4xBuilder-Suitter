'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mockUsers, mockSuits } from '@/lib/mock-data'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = {
    users: mockUsers.filter(
      (u) =>
        u.displayName.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
    ),
    suits: mockSuits.filter((s) =>
      s.content.toLowerCase().includes(query.toLowerCase())
    ),
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Suitter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="w-full pl-12 pr-4 py-3 bg-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Dropdown results */}
      {open && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg max-h-96 overflow-y-auto z-50">
          {results.users.length > 0 && (
            <div>
              <div className="px-4 py-2 font-semibold text-sm text-muted-foreground">
                People
              </div>
              {results.users.map((user) => (
                <a
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="px-4 py-3 hover:bg-secondary flex items-center gap-3 transition-colors"
                >
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {results.suits.length > 0 && (
            <div>
              <div className="px-4 py-2 font-semibold text-sm text-muted-foreground border-t border-border">
                Suits
              </div>
              {results.suits.slice(0, 3).map((suit) => (
                <a
                  key={suit.id}
                  href={`/suit/${suit.id}`}
                  className="px-4 py-3 hover:bg-secondary border-t border-border transition-colors line-clamp-2"
                >
                  <p className="text-sm font-semibold">{suit.author.displayName}</p>
                  <p className="text-sm text-foreground">{suit.content}</p>
                </a>
              ))}
            </div>
          )}

          {results.users.length === 0 && results.suits.length === 0 && (
            <div className="px-4 py-6 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
