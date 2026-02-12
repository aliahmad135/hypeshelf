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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-1/2 bg-muted rounded mb-2" />
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No recommendations yet. Be the first to add one!</p>
      </div>
    )
  }

  const latestRecommendations = recommendations.slice(0, 6)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {latestRecommendations.map((rec) => (
        <Card key={rec._id} className="flex flex-col">
          {rec.isStaffPick && (
            <div className="flex items-center gap-1 px-6 pt-6 pb-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                Staff Pick
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="line-clamp-2">{rec.title}</CardTitle>
            <CardDescription>
              <Badge
                variant="outline"
                className={GENRE_COLORS[rec.genre]}
              >
                {GENRE_LABELS[rec.genre]}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {rec.blurb}
            </p>
            <Link
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

