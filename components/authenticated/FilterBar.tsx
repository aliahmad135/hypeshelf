"use client"

import { GENRES, GENRE_LABELS } from "@/lib/constants"
import { Genre } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  selectedGenre: Genre | "all"
  onGenreChange: (genre: Genre | "all") => void
}

export function FilterBar({ selectedGenre, onGenreChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-lg">
      <span className="text-sm font-semibold text-foreground/90 mr-2">Filter:</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onGenreChange("all")}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
          selectedGenre === "all"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg scale-105"
            : "bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 text-foreground/70 hover:text-foreground"
        )}
      >
        All
      </Button>
      {GENRES.map((genre) => (
        <Button
          key={genre}
          variant="ghost"
          size="sm"
          onClick={() => onGenreChange(genre)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            selectedGenre === genre
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg scale-105"
              : "bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 text-foreground/70 hover:text-foreground"
          )}
        >
          {GENRE_LABELS[genre]}
        </Button>
      ))}
    </div>
  )
}

