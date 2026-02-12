"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { GENRES, GENRE_LABELS } from "@/lib/constants"
import { Genre } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecommendationForm() {
  const router = useRouter()
  const createRecommendation = useMutation(api.recommendations.create)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    genre: "action" as Genre,
    link: "",
    blurb: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link is required"
    } else {
      try {
        new URL(formData.link)
      } catch {
        newErrors.link = "Please enter a valid URL"
      }
    }

    if (!formData.blurb.trim()) {
      newErrors.blurb = "Blurb is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await createRecommendation({
        title: formData.title.trim(),
        genre: formData.genre,
        link: formData.link.trim(),
        blurb: formData.blurb.trim(),
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create recommendation:", error)
      alert("Failed to create recommendation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Add a Recommendation
        </CardTitle>
        <CardDescription className="text-base mt-2 text-foreground/70">
          Share something you&apos;re hyped about with your friends
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-2 text-foreground/90">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter the title"
              className={`rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 ${errors.title ? "border-red-500" : "border-white/20 dark:border-gray-700/50"} focus:border-purple-500 transition-colors`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-semibold mb-2 text-foreground/90">
              Genre *
            </label>
            <Select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
              className="rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 focus:border-purple-500"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {GENRE_LABELS[genre]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-semibold mb-2 text-foreground/90">
              Link *
            </label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
              className={`rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 ${errors.link ? "border-red-500" : "border-white/20 dark:border-gray-700/50"} focus:border-purple-500 transition-colors`}
            />
            {errors.link && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.link}</p>
            )}
          </div>

          <div>
            <label htmlFor="blurb" className="block text-sm font-semibold mb-2 text-foreground/90">
              Blurb *
            </label>
            <Textarea
              id="blurb"
              value={formData.blurb}
              onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              placeholder="Why are you hyped about this?"
              rows={4}
              className={`rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 ${errors.blurb ? "border-red-500" : "border-white/20 dark:border-gray-700/50"} focus:border-purple-500 transition-colors resize-none`}
            />
            {errors.blurb && (
              <p className="text-sm text-red-500 mt-1 font-medium">{errors.blurb}</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "Adding..." : "Add Recommendation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

