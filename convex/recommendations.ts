import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth, requireAdmin, getCurrentUser } from "./auth"
import { Id } from "./_generated/dataModel"

export const list = query({
  args: {
    genre: v.optional(
      v.union(
        v.literal("horror"),
        v.literal("action"),
        v.literal("comedy"),
        v.literal("drama"),
        v.literal("sci-fi"),
        v.literal("thriller"),
        v.literal("romance"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    let recommendations
    if (args.genre) {
      recommendations = await ctx.db
        .query("recommendations")
        .withIndex("by_genre", (q) => q.eq("genre", args.genre!))
        .collect()
    } else {
      recommendations = await ctx.db.query("recommendations").collect()
    }

    recommendations.sort((a, b) => b.createdAt - a.createdAt)

    const recommendationsWithUsers = await Promise.all(
      recommendations.map(async (rec) => {
        const user = await ctx.db.get(rec.userId)
        return {
          ...rec,
          user: user
            ? {
                _id: user._id,
                clerkId: user.clerkId,
                role: user.role,
              }
            : null,
        }
      })
    )

    return recommendationsWithUsers
  },
})

export const getByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const recommendations = await ctx.db
      .query("recommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    recommendations.sort((a, b) => b.createdAt - a.createdAt)
    return recommendations
  },
})

export const getStaffPicks = query({
  args: {},
  handler: async (ctx) => {
    const recommendations = await ctx.db
      .query("recommendations")
      .withIndex("by_staff_pick", (q) => q.eq("isStaffPick", true))
      .collect()

    recommendations.sort((a, b) => b.createdAt - a.createdAt)

    const recommendationsWithUsers = await Promise.all(
      recommendations.map(async (rec) => {
        const user = await ctx.db.get(rec.userId)
        return {
          ...rec,
          user: user
            ? {
                _id: user._id,
                clerkId: user.clerkId,
                role: user.role,
              }
            : null,
        }
      })
    )

    return recommendationsWithUsers
  },
})

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)

    try {
      new URL(args.link)
    } catch {
      throw new Error("Invalid URL format")
    }

    if (!args.title.trim()) {
      throw new Error("Title is required")
    }
    if (!args.blurb.trim()) {
      throw new Error("Blurb is required")
    }

    const recommendationId = await ctx.db.insert("recommendations", {
      title: args.title.trim(),
      genre: args.genre,
      link: args.link.trim(),
      blurb: args.blurb.trim(),
      userId: user._id,
      createdAt: Date.now(),
      isStaffPick: false,
    })

    return recommendationId
  },
})

export const deleteRecommendation = mutation({
  args: {
    id: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const recommendation = await ctx.db.get(args.id)

    if (!recommendation) {
      throw new Error("Recommendation not found")
    }

    if (user.role !== "admin" && recommendation.userId !== user._id) {
      throw new Error("Unauthorized: You can only delete your own recommendations")
    }

    await ctx.db.delete(args.id)
  },
})

export const toggleStaffPick = mutation({
  args: {
    id: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const recommendation = await ctx.db.get(args.id)
    if (!recommendation) {
      throw new Error("Recommendation not found")
    }

    await ctx.db.patch(args.id, {
      isStaffPick: !recommendation.isStaffPick,
    })
  },
})

