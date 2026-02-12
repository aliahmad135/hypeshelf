import { RecommendationList } from "@/components/public/RecommendationList"
import { PublicSignInButton } from "@/components/public/SignInButton"

export default function PublicPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              HypeShelf
            </h1>
            <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto font-medium">
              Collect and share the stuff you&apos;re hyped about.
            </p>
            <PublicSignInButton />
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Latest Recommendations
            </h2>
            <RecommendationList />
          </div>
        </div>
      </div>
    </div>
  )
}

