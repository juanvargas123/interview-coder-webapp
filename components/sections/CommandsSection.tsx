"use client"
import { HoverEffect } from "../ui/card-hover-effect"
import { useLanguage } from "@/lib/i18n/LanguageContext"

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

export function CommandsSection() {
  const { t } = useLanguage()
  
  const commands = [
    {
      key: "hide-show",
      title: "⌘ + B",
      description: t('commands.hideShow')
    },
    {
      key: "screenshot",
      title: "⌘ + H",
      description: t('commands.captureScreenshot')
    },
    {
      key: "generate",
      title: "⌘ + ↵",
      description: t('commands.generateSolution')
    },
    {
      key: "move",
      title: "⌘ + ↑↓←→",
      description: t('commands.moveWindow')
    },
    {
      key: "reset",
      title: "⌘ + R",
      description: t('commands.reset')
    },
    {
      key: "quit",
      title: "⌘ + Q",
      description: t('commands.quit')
    }
  ]

  return (
    <section className="py-24 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="white-gradient font-inter">{t('commands.title')}</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {t('commands.subtitle')}
          </p>
        </div>
        <HoverEffect items={commands} />
      </div>
    </section>
  )
}
