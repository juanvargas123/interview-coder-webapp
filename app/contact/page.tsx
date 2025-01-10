import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/sections/Footer"
import Navbar from "@/components/sections/Navbar"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl">Customer Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-neutral-400 mb-1">Name</h3>
                <p className="text-white">Chungin Lee</p>
              </div>
              <div>
                <h3 className="text-neutral-400 mb-1">Phone</h3>
                <p className="text-white">470-919-2464</p>
              </div>
              <div>
                <h3 className="text-neutral-400 mb-1">Email</h3>
                <p className="text-white">churlee12@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
