import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, List, Users } from 'lucide-react'

interface List {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: Date
}

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([
    {
      id: '1',
      name: 'Sui Developers',
      description: 'Amazing developers building on Sui',
      memberCount: 42,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'NFT Collectors',
      description: 'NFT enthusiasts and collectors',
      memberCount: 128,
      createdAt: new Date('2024-02-20'),
    },
  ])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')

  const handleCreateList = () => {
    if (!newListName.trim()) return

    const newList: List = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      memberCount: 0,
      createdAt: new Date(),
    }

    setLists([...lists, newList])
    setNewListName('')
    setNewListDescription('')
    setShowCreateDialog(false)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <List className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Lists</h1>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </Button>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="p-6">
        {lists.length === 0 ? (
          <div className="text-center py-12">
            <List className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No lists yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create a list to organize accounts you follow</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map(list => (
              <div
                key={list.id}
                className="rounded-2xl border border-border p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{list.name}</h3>
                    <p className="text-sm text-muted-foreground">{list.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{list.memberCount} members</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create List Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Create a list to organize accounts you follow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
