import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PostCard } from '@/components/PostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, List, Users, Plus, X } from 'lucide-react'
import { mockUsers, getPosts, type Post, type User } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { formatDistanceToNow } from 'date-fns'

interface List {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: Date
  members: string[] // User IDs
}

export default function ListDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [list, setList] = useState<List | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load following state
    const stored = localStorage.getItem('suitter_following')
    if (stored) {
      try {
        const followingArray = JSON.parse(stored)
        setFollowing(new Set(followingArray))
      } catch (error) {
        console.error('Failed to parse following state:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (id) {
      setLoading(true)
      setTimeout(() => {
        // Load list from localStorage or use mock data
        const storedLists = localStorage.getItem('suitter_lists')
        let foundList: List | null = null

        if (storedLists) {
          try {
            const lists: List[] = JSON.parse(storedLists)
            foundList = lists.find(l => l.id === id) || null
          } catch (error) {
            console.error('Failed to parse lists:', error)
          }
        }

        // If not found, create a mock list
        if (!foundList) {
          foundList = {
            id: id,
            name: 'Sui Developers',
            description: 'Amazing developers building on Sui',
            memberCount: 3,
            createdAt: new Date('2024-01-15'),
            members: ['1', '2', '3']
          }
        }

        setList(foundList)

        // Load members
        const listMembers = foundList.members.map(memberId => 
          mockUsers.find(u => u.id === memberId)
        ).filter(Boolean) as User[]
        setMembers(listMembers)

        // Load posts from members
        const memberPosts = getPosts().filter(post => 
          foundList!.members.includes(post.authorId)
        )
        setPosts(memberPosts)
        setLoading(false)
      }, 500)
    }
  }, [id])

  const handleRemoveMember = (userId: string) => {
    if (!list || !currentUser) return
    // In a real app, check if current user is list owner
    setList({
      ...list,
      members: list.members.filter(id => id !== userId),
      memberCount: list.memberCount - 1
    })
    setMembers(members.filter(m => m.id !== userId))
    toast({
      description: 'Member removed from list',
    })
  }

  const handleFollow = (userId: string) => {
    const isFollowingUser = following.has(userId)
    
    if (isFollowingUser) {
      setFollowing(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      toast({
        description: 'User unfollowed',
      })
    } else {
      setFollowing(prev => new Set(prev).add(userId))
      toast({
        description: 'User followed',
      })
    }
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
        : post
    ))
  }

  const handleReshare = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, reshared: !post.reshared, reshareCount: post.reshared ? post.reshareCount - 1 : post.reshareCount + 1 }
        : post
    ))
    toast({
      description: 'Post reshared',
    })
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ))
    toast({
      description: posts.find(p => p.id === postId)?.bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
    })
  }

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url)
    toast({
      description: 'Link copied to clipboard',
    })
  }

  const handleShare = (postId: string) => {
    toast({
      description: 'Post shared',
    })
  }

  const handleMute = (userId: string) => {
    toast({
      description: 'User muted',
    })
  }

  const handleBlock = (userId: string) => {
    toast({
      description: 'User blocked',
    })
  }

  const handleReport = (postId: string) => {
    toast({
      description: 'Post reported',
    })
  }

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
    toast({
      description: 'Post deleted',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!list) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">List not found</p>
        <Link to="/lists">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lists
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/lists')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <List className="w-5 h-5" />
            <div>
              <h1 className="text-xl font-bold">{list.name}</h1>
              <p className="text-sm text-muted-foreground">{list.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* List Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{list.memberCount}</p>
            <p className="text-sm text-muted-foreground">Members</p>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(list.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Members</h2>
        {members.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No members in this list</p>
        ) : (
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                <Link to={`/profile/${member.id}`} className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{member.username}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  {currentUser && currentUser.id !== member.id && (
                    <Button
                      variant={following.has(member.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFollow(member.id)}
                    >
                      {following.has(member.id) ? 'Following' : 'Follow'}
                    </Button>
                  )}
                  {currentUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posts from Members */}
      <div className="divide-y divide-border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Posts from Members</h2>
        </div>
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No posts from list members yet</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onReshare={handleReshare}
              onBookmark={handleBookmark}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
              onMute={handleMute}
              onBlock={handleBlock}
              onReport={handleReport}
              onDelete={handleDelete}
              onFollow={handleFollow}
            />
          ))
        )}
      </div>
    </div>
  )
}

