"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { RecommendationCard } from "@/components/authenticated/RecommendationCard"
import { FilterBar } from "@/components/authenticated/FilterBar"
import { Button } from "@/components/ui/button"
import { useUserRole } from "@/hooks/useUserRole"
import { Genre } from "@/lib/types"
import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  const { userId } = useUserRole()
  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all")
  const allRecommendations = useQuery(api.recommendations.list, {})

  if (allRecommendations === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">HypeShelf</h1>
              <p className="text-muted-foreground">Collect and share the stuff you&apos;re hyped about.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/add">
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recommendation
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                <div className="h-6 w-3/4 bg-muted rounded mb-4" />
                <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredRecommendations =
    selectedGenre === "all"
      ? allRecommendations
      : allRecommendations.filter((rec) => rec.genre === selectedGenre)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">HypeShelf</h1>
            <p className="text-muted-foreground">Collect and share the stuff you&apos;re hyped about.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Recommendation
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>

        <FilterBar selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              {selectedGenre === "all"
                ? "No recommendations yet. Be the first to add one!"
                : `No ${selectedGenre} recommendations found.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((rec) => (
              <RecommendationCard
                key={rec._id}
                recommendation={rec}
                currentUserId={userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

