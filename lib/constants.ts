import { Genre } from "./types"

export const GENRES: Genre[] = [
  "horror",
  "action",
  "comedy",
  "drama",
  "sci-fi",
  "thriller",
  "romance",
  "other",
]

export const GENRE_LABELS: Record<Genre, string> = {
  horror: "Horror",
  action: "Action",
  comedy: "Comedy",
  drama: "Drama",
  "sci-fi": "Sci-Fi",
  thriller: "Thriller",
  romance: "Romance",
  other: "Other",
}

export const GENRE_COLORS: Record<Genre, string> = {
  horror: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  action: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  comedy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  drama: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "sci-fi": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  thriller: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  romance: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

