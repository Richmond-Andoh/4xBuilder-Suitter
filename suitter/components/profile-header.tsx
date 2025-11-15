'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Calendar, MapPin, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface ProfileHeaderProps {
  user: User
  isOwnProfile?: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onEditProfile?: () => void
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onEditProfile,
}: ProfileHeaderProps) {
  const { toast } = useToast()
  const [following, setFollowing] = useState(isFollowing)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editData, setEditData] = useState({
    displayName: user.displayName,
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  })

  const handleFollowClick = () => {
    setFollowing(!following)
    onFollow?.()
    
    toast({
      description: following ? `Unfollowed @${user.username}` : `Following @${user.username}`,
    })
  }

  const handleEditProfile = () => {
    setShowEditDialog(true)
  }

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    toast({
      description: 'Profile updated successfully',
    })
    setShowEditDialog(false)
    onEditProfile?.()
  }

  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <>
      <div>
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 relative">
          <Link href="/">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Profile info */}
        <div className="px-4 pb-4">
          {/* Avatar overlapping banner */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-border">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {/* Follow/Edit button */}
            <div className="mt-4">
              {isOwnProfile ? (
                <Button variant="outline" onClick={handleEditProfile} className="hover-lift">
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleFollowClick}
                  variant={following ? 'outline' : 'default'}
                  className="hover-lift min-w-[100px]"
                >
                  {following ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* User details */}
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>

            {/* Bio */}
            {user.bio && <p className="mt-3 text-foreground">{user.bio}</p>}

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  {user.website}
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Follow stats */}
            <div className="flex gap-6 mt-4">
              <button className="hover:underline">
                <span className="font-semibold text-foreground">{user.followingCount}</span>{' '}
                <span className="text-muted-foreground">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-semibold text-foreground">{user.followerCount}</span>{' '}
                <span className="text-muted-foreground">Followers</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editData.website}
                onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
