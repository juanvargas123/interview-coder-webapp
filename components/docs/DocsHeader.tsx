interface DocsHeaderProps {
  title: string
  description: string
}

export function DocsHeader({ title, description }: DocsHeaderProps) {
  return (
    <div className="space-y-2 mb-12">
      <h1 className="text-4xl font-bold text-zinc-100">{title}</h1>
      <p className="text-lg text-zinc-400">{description}</p>
    </div>
  )
}
