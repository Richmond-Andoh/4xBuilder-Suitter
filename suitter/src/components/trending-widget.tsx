'use client'

import Link from 'next/link'
import { TrendingUp, Activity } from 'lucide-react'

const TRENDING_TOPICS = [
  {
    id: '1',
    hashtag: '#SuiBlockchain',
    count: '12.5K',
    description: 'Suits',
    trend: '+15%',
  },
  {
    id: '2',
    hashtag: '#DeFi',
    count: '8.3K',
    description: 'Suits',
    trend: '+8%',
  },
  {
    id: '3',
    hashtag: '#Web3',
    count: '5.1K',
    description: 'Suits',
    trend: '+5%',
  },
  {
    id: '4',
    hashtag: '#NFT',
    count: '3.8K',
    description: 'Suits',
    trend: '+3%',
  },
  {
    id: '5',
    hashtag: '#SmartContracts',
    count: '2.9K',
    description: 'Suits',
    trend: '+2%',
  },
]

export function TrendingWidget() {
  return (
    <div className="glass-effect border-2 border-primary/20 rounded-2xl p-6 neon-glow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg animate-pulse-glow">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Trending Now
        </h2>
      </div>

      <div className="space-y-1">
        {TRENDING_TOPICS.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/search?q=${topic.hashtag}`}
            className="block p-4 group relative overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-primary group-hover:text-secondary transition-colors">
                    {topic.hashtag}
                  </p>
                  <span className="text-xs font-semibold text-green-400 bg-green-400/20 px-2 py-0.5 rounded-full">
                    {topic.trend}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {topic.count} {topic.description}
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-400 group-hover:translate-y-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
