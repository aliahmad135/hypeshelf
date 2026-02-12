"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect } from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const syncUser = useMutation(api.users.syncUser)

  useEffect(() => {
    syncUser().catch((error) => {
      console.error("Failed to sync user:", error)
    })
  }, [syncUser])

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

