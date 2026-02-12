import { RecommendationForm } from "@/components/authenticated/RecommendationForm"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AddPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
        <RecommendationForm />
      </div>
    </div>
  )
}

