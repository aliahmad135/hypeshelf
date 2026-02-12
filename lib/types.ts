import { Id } from "./convex/_generated/dataModel"

export type Role = "admin" | "user"

export type Genre = 
  | "horror" 
  | "action" 
  | "comedy" 
  | "drama" 
  | "sci-fi" 
  | "thriller" 
  | "romance" 
  | "other"

export interface Recommendation {
  _id: Id<"recommendations">
  title: string
  genre: Genre
  link: string
  blurb: string
  userId: Id<"users">
  createdAt: number
  isStaffPick: boolean
}

export interface User {
  _id: Id<"users">
  clerkId: string
  role: Role
  createdAt: number
}

