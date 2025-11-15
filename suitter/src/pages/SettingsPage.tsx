import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Trash2, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="p-6 space-y-8">
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Private Account</Label>
                <p className="text-sm text-muted-foreground">Only approved followers can see your posts</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Activity Status</Label>
                <p className="text-sm text-muted-foreground">Allow others to see when you're active</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Let others send you direct messages</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="alice_sui" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alice@example.com" className="mt-2" />
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-destructive p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
