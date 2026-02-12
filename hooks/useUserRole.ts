import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useUserRole() {
  const userRole = useQuery(api.users.getUserRole)
  const isAdminQuery = useQuery(api.users.isAdmin)

  return {
    role: userRole?.role ?? null,
    userId: userRole?._id ?? null,
    isAdmin: isAdminQuery ?? false,
    isLoading: userRole === undefined || isAdminQuery === undefined,
  }
}

