import { Link } from 'react-router-dom'
import { TrendingUp, Flame, Hash, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const trendingTopics = [
  { tag: 'SuiBlockchain', posts: 12500, trend: '+12%' },
  { tag: 'Web3', posts: 8900, trend: '+8%' },
  { tag: 'NFT', posts: 5670, trend: '+5%' },
  { tag: 'DeFi', posts: 4320, trend: '+3%' },
  { tag: 'MoveLanguage', posts: 3210, trend: '+2%' },
]

export function TrendingWidget() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Trending</h3>
          <p className="text-xs text-muted-foreground">What's hot now</p>
        </div>
      </div>
      <div className="space-y-2">
        {trendingTopics.map((topic, index) => (
          <Link
            key={topic.tag}
            to={`/explore?q=${topic.tag}`}
            className={cn(
              "group relative flex items-center gap-3 p-3 rounded-xl",
              "hover:bg-primary/5 transition-all duration-200",
              "border border-transparent hover:border-primary/20"
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
              index === 0 
                ? "bg-primary text-primary-foreground" 
                : index === 1
                ? "bg-primary/80 text-primary-foreground"
                : index === 2
                ? "bg-primary/60 text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm truncate">#{topic.tag}</span>
                {index < 3 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {topic.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {topic.posts.toLocaleString()} posts
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
      <Link
        to="/explore"
        className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
      >
        Show more
      </Link>
    </div>
  )
}

