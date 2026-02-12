import { RecommendationList } from "@/components/public/RecommendationList"
import { PublicSignInButton } from "@/components/public/SignInButton"

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">HypeShelf</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Collect and share the stuff you're hyped about.
            </p>
            <PublicSignInButton />
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Latest Recommendations</h2>
            <RecommendationList />
          </div>
        </div>
      </div>
    </div>
  )
}

