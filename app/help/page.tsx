import { Suspense } from "react"
import HelpCenterContent from "./HelpCenterContent"

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden max-w-screen md:mt-0 mt-16">
      <Suspense
        fallback={
          <div className="text-center space-y-4">
            <h2 className="text-xl mb-4">Loading help center...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        }
      >
        <HelpCenterContent />
      </Suspense>
    </div>
  )
}
