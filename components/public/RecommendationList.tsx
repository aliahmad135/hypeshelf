"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GENRE_LABELS, GENRE_COLORS } from "@/lib/constants"
import { ExternalLink, Star } from "lucide-react"
import Link from "next/link"

export function RecommendationList() {
  const recommendations = useQuery(api.recommendations.list, {})

  if (recommendations === undefined) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-6 animate-pulse">
            <div className="h-6 w-3/4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded mb-4" />
            <div className="h-4 w-1/2 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-full mb-4" />
            <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded mb-4" />
            <div className="h-4 w-1/3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl">
          <p className="text-foreground/70 font-medium">No recommendations yet. Be the first to add one!</p>
        </div>
      </div>
    )
  }

  const latestRecommendations = recommendations.slice(0, 6)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {latestRecommendations.map((rec) => (
        <Card key={rec._id} className="flex flex-col group relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            {rec.isStaffPick && (
              <div className="flex items-center gap-2 px-6 pt-5 pb-3 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-sm border-b border-yellow-400/30">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                  Staff Pick
                </span>
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-lg mb-3 font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {rec.title}
              </CardTitle>
              <Badge
                variant="outline"
                className={`${GENRE_COLORS[rec.genre]} text-xs border-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50`}
              >
                {GENRE_LABELS[rec.genre]}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-0">
              <p className="text-sm text-foreground/80 mb-4 line-clamp-3 flex-1 leading-relaxed">
                {rec.blurb}
              </p>
              <Link
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                View <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              {rec.user && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20 dark:border-gray-700/50">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {rec.user.role === "admin" ? "H" : rec.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <p className="text-xs font-medium text-foreground/70">
                    {rec.user.role === "admin" 
                      ? "HypeShelf team" 
                      : rec.user.name || "User"}
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}

