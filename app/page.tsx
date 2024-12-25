import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Your Next.js App</CardTitle>
          <CardDescription>
            Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </main>
  )
}
