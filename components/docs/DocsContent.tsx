import { DocsHeader } from "./DocsHeader"
import { QuickLinks } from "./QuickLinks"
import { DocsSections } from "./DocsSections"

export function DocsContent() {
  return (
    <main className="md:ml-72 min-h-screen pt-[72px] md:pt-0 bg-gradient-to-b from-zinc-900/50 to-black">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <DocsHeader
          title="Documentation"
          description="Find all the guides and resources you need to get started with Interview Coder."
        />
        <QuickLinks />
        <DocsSections />
      </div>
    </main>
  )
}
