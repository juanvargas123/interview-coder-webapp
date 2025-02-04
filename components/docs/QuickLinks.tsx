interface QuickLinkProps {
  title: string
  description: string
}

function QuickLinkCard({ title, description }: QuickLinkProps) {
  return (
    <div className="group relative rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 hover:border-primary/40 transition-all hover:bg-zinc-800/20">
      <h3 className="text-xl font-semibold mb-2 text-zinc-200 group-hover:text-primary/80 transition-colors">
        {title} →
      </h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}

export function QuickLinks() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <QuickLinkCard
        title="Getting Started"
        description="Learn the basics and get up and running with Interview Coder in minutes."
      />
      <QuickLinkCard
        title="Core Concepts"
        description="Understand the fundamental concepts and features of Interview Coder."
      />
    </div>
  )
}
