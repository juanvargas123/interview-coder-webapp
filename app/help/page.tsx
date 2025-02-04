import { Suspense } from "react"
import HelpCenterContent from "./HelpCenterContent"

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden max-w-screen md:mt-0 mt-16">
      <Suspense
        fallback={
          <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="space-y-6 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
              <p className="text-muted-foreground text-sm font-medium">
                Loading help center
              </p>
            </div>
          </div>
        }
      >
        <HelpCenterContent />
      </Suspense>
    </div>
  )
}
