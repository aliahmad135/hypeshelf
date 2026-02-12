import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"]),

  recommendations: defineTable({
    title: v.string(),
    genre: v.union(
      v.literal("horror"),
      v.literal("action"),
      v.literal("comedy"),
      v.literal("drama"),
      v.literal("sci-fi"),
      v.literal("thriller"),
      v.literal("romance"),
      v.literal("other")
    ),
    link: v.string(),
    blurb: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    isStaffPick: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_genre", ["genre"])
    .index("by_staff_pick", ["isStaffPick"]),
})

