interface QuickTipProps {
  title: string
  description: string
}

function QuickTip({ title, description }: QuickTipProps) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
      <h4 className="font-semibold mb-2 text-zinc-200">{title}</h4>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="border border-zinc-800/50 bg-zinc-900/30 rounded-xl p-4">
      <h3 className="font-semibold mb-2 text-zinc-200">
        {number}. {title}
      </h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}

export function IntroductionSection() {
  return (
    <section id="introduction">
      <h2 className="text-2xl font-bold mb-4 text-zinc-100">Introduction</h2>
      <p className="text-zinc-400 mb-4">
        Interview Coder is an AI-powered coding assistant that helps you prepare
        for technical interviews. With features like real-time code generation,
        debugging assistance, and interview practice mode, you'll be
        well-equipped for your next technical interview.
      </p>
      <QuickTip
        title="Quick Tip"
        description="Start with the Quick Start guide to get familiar with the basic features and commands."
      />
    </section>
  )
}

export function QuickStartSection() {
  return (
    <section id="quick-start">
      <h2 className="text-2xl font-bold mb-4 text-zinc-100">Quick Start</h2>
      <div className="space-y-4">
        <StepCard
          number={1}
          title="Installation"
          description="Download and install Interview Coder for your operating system."
        />
        <StepCard
          number={2}
          title="Sign In"
          description="Create an account or sign in to get started."
        />
        <StepCard
          number={3}
          title="First Command"
          description="Try your first command to generate code or get help with debugging."
        />
      </div>
    </section>
  )
}

export function DocsSections() {
  return (
    <div className="space-y-16">
      <IntroductionSection />
      <QuickStartSection />
    </div>
  )
}
