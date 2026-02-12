"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GENRE_LABELS, GENRE_COLORS } from "@/lib/constants"
import { ExternalLink, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUserRole } from "@/hooks/useUserRole"
import { Id } from "@/convex/_generated/dataModel"
import { useState } from "react"

interface RecommendationCardProps {
  recommendation: {
    _id: Id<"recommendations">
    title: string
    genre: string
    link: string
    blurb: string
    userId: Id<"users">
    createdAt: number
    isStaffPick: boolean
    user: {
      _id: Id<"users">
      clerkId: string
      name?: string
      role: string
    } | null
  }
  currentUserId: Id<"users"> | null
}

export function RecommendationCard({ recommendation, currentUserId }: RecommendationCardProps) {
  const deleteRecommendation = useMutation(api.recommendations.deleteRecommendation)
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick)
  const { isAdmin } = useUserRole()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const canDelete = isAdmin || (currentUserId && recommendation.userId === currentUserId)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recommendation?")) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteRecommendation({ id: recommendation._id })
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete recommendation")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStaffPick = async () => {
    setIsToggling(true)
    try {
      await toggleStaffPick({ id: recommendation._id })
    } catch (error) {
      console.error("Failed to toggle staff pick:", error)
      alert("Failed to update staff pick status. You may not have permission.")
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card className="flex flex-col group relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        {recommendation.isStaffPick && (
          <div className="flex items-center gap-2 px-6 pt-5 pb-3 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-sm border-b border-yellow-400/30">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
              Staff Pick
            </span>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-2 text-lg mb-3 font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {recommendation.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`${GENRE_COLORS[recommendation.genre as keyof typeof GENRE_COLORS]} text-xs border-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50`}
              >
                {GENRE_LABELS[recommendation.genre as keyof typeof GENRE_LABELS]}
              </Badge>
            </div>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-shrink-0 hover:bg-red-500/20 dark:hover:bg-red-500/30 rounded-full transition-all"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-0">
          <p className="text-sm text-foreground/80 mb-4 line-clamp-3 flex-1 leading-relaxed">
            {recommendation.blurb}
          </p>
          <div className="flex items-center justify-between mb-3">
            <Link
              href={recommendation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              View <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleStaffPick}
                disabled={isToggling}
                className="text-xs h-7 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70"
              >
                {isToggling
                  ? "Updating..."
                  : recommendation.isStaffPick
                  ? "Remove Staff Pick"
                  : "Mark as Staff Pick"}
              </Button>
            )}
          </div>
          {recommendation.user && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {recommendation.user.role === "admin" ? "H" : recommendation.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <p className="text-xs font-medium text-foreground/70">
                  {recommendation.user.role === "admin" 
                    ? "HypeShelf team" 
                    : recommendation.user.name || "User"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

