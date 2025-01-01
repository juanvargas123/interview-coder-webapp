import { HoverEffect } from "../ui/card-hover-effect"

const CommandDescription = ({
  mode,
  description
}: {
  mode: string
  description: string
}) => (
  <div className="flex flex-col">
    <span className="font-medium text-neutral-200 mb-1">{mode}:</span>
    <span className="text-neutral-400">{description}</span>
  </div>
)

const commands = [
  {
    key: "hide-show",
    title: "⌘ + B",
    description: "Hide/show the Interview Coder window instantly."
  },
  {
    key: "screenshot",
    title: "⌘ + H",
    description: (
      <div className="space-y-3">
        <CommandDescription
          mode="Problem Mode"
          description="Capture screenshots of the interview question and requirements."
        />
        <CommandDescription
          mode="Solution Mode"
          description="Take screenshots of your code to get optimization suggestions."
        />
      </div>
    )
  },
  {
    key: "generate",
    title: "⌘ + ↵",
    description: (
      <div className="space-y-3">
        <CommandDescription
          mode="Problem Mode"
          description="Generate an initial solution with detailed explanations based on the problem screenshots."
        />
        <CommandDescription
          mode="Solution Mode"
          description="Debug and optimize your existing solution based on your code screenshots."
        />
      </div>
    )
  },
  {
    key: "move",
    title: "⌘ + ↑↓←→",
    description:
      "Move the window around your screen without touching the mouse."
  },
  {
    key: "reset",
    title: "⌘ + R",
    description: "Reset everything to start fresh with a new problem."
  },
  {
    key: "quit",
    title: "⌘ + Q",
    description:
      "Quit the application to remove the functionality of all keyboard commands."
  }
]

export function CommandsSection() {
  return (
    <section className="py-24 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="white-gradient font-inter">Commands we love</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            These commands are designed to be natural and easy to remember.
          </p>
        </div>
        <HoverEffect items={commands} />
      </div>
    </section>
  )
}
