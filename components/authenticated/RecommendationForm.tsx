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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add a Recommendation</CardTitle>
        <CardDescription>
          Share something you&apos;re hyped about with your friends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter the title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-2">
              Genre *
            </label>
            <Select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {GENRE_LABELS[genre]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium mb-2">
              Link *
            </label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
              className={errors.link ? "border-destructive" : ""}
            />
            {errors.link && (
              <p className="text-sm text-destructive mt-1">{errors.link}</p>
            )}
          </div>

          <div>
            <label htmlFor="blurb" className="block text-sm font-medium mb-2">
              Blurb *
            </label>
            <Textarea
              id="blurb"
              value={formData.blurb}
              onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              placeholder="Why are you hyped about this?"
              rows={4}
              className={errors.blurb ? "border-destructive" : ""}
            />
            {errors.blurb && (
              <p className="text-sm text-destructive mt-1">{errors.blurb}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Recommendation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

