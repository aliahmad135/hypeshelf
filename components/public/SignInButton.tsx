"use client"

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PublicSignInButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="lg">Sign in to add yours</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      </SignedIn>
    </>
  )
}

