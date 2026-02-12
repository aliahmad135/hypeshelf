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
  const { userId, role, isAdmin } = useUserRole()
  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all")
  const allRecommendations = useQuery(api.recommendations.list, {})

  if (allRecommendations === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  HypeShelf
                </h1>
                {role && (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isAdmin 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  }`}>
                    {isAdmin ? "Admin" : "User"}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-lg">Collect and share the stuff you&apos;re hyped about.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/add">
                <Button size="lg" disabled className="shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recommendation
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>
          <div className="mb-8 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 animate-pulse">
            <div className="h-6 w-32 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-6 animate-pulse">
                <div className="h-6 w-3/4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-full mb-4" />
                <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded mb-4" />
                <div className="h-4 w-1/3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full" />
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                HypeShelf
              </h1>
              {role && (
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ${
                  isAdmin 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                }`}>
                  {isAdmin ? "Admin" : "User"}
                </span>
              )}
            </div>
            <p className="text-foreground/70 text-lg font-medium">Collect and share the stuff you&apos;re hyped about.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/add">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full px-6">
                <Plus className="h-4 w-4 mr-2" />
                Add Recommendation
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>

        <div className="mb-8">
          <FilterBar selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl">
              <p className="text-foreground/70 font-medium">
                {selectedGenre === "all"
                  ? "No recommendations yet. Be the first to add one!"
                  : `No ${selectedGenre} recommendations found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

