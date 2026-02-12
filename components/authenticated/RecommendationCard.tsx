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
    <Card className="flex flex-col">
      {recommendation.isStaffPick && (
        <div className="flex items-center gap-1 px-6 pt-6 pb-2">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
            Staff Pick
          </span>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{recommendation.title}</CardTitle>
            <CardDescription className="mt-2">
              <Badge variant="outline" className={GENRE_COLORS[recommendation.genre as keyof typeof GENRE_COLORS]}>
                {GENRE_LABELS[recommendation.genre as keyof typeof GENRE_LABELS]}
              </Badge>
            </CardDescription>
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
          {recommendation.blurb}
        </p>
        <div className="flex items-center justify-between">
          <Link
            href={recommendation.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View <ExternalLink className="h-3 w-3" />
          </Link>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStaffPick}
              disabled={isToggling}
              className="text-xs"
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
          <p className="text-xs text-muted-foreground mt-2">
            Added by {recommendation.user.role === "admin" ? "Admin" : "User"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

