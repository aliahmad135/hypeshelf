import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser, requireAuth } from "./auth"

export const syncUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()

    const name = identity.name || identity.email?.split("@")[0] || "User"
    const email = identity.email || undefined

    if (existingUser) {
      if (!existingUser.name || existingUser.name !== name) {
        await ctx.db.patch(existingUser._id, { name, email })
      }
      return existingUser._id
    }

    const userCount = await ctx.db.query("users").collect()
    const role = userCount.length === 0 ? ("admin" as const) : ("user" as const)

    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name,
      email,
      role,
      createdAt: Date.now(),
    })

    return userId
  },
})

export const getUserRole = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) {
      return null
    }
    return {
      _id: user._id,
      role: user.role,
    }
  },
})

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    return user ? user.role === "admin" : false
  },
})

