"use client"

import { Select } from "@/components/ui/select"
import { GENRES, GENRE_LABELS } from "@/lib/constants"
import { Genre } from "@/lib/types"

interface FilterBarProps {
  selectedGenre: Genre | "all"
  onGenreChange: (genre: Genre | "all") => void
}

export function FilterBar({ selectedGenre, onGenreChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <label htmlFor="genre-filter" className="text-sm font-medium">
        Filter by genre:
      </label>
      <Select
        id="genre-filter"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value as Genre | "all")}
        className="w-48"
      >
        <option value="all">All Genres</option>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>
            {GENRE_LABELS[genre]}
          </option>
        ))}
      </Select>
    </div>
  )
}

