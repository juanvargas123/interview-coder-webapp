import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/sections/Footer"
import Navbar from "@/components/sections/Navbar"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-12 text-center">Our Policies</h1>

          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl">Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300">
                We offer a 24-hour money-back guarantee for our software
                subscription. If you're not satisfied with our service, you can
                request a full refund within 24 hours of your purchase by
                contacting our customer service team.
              </p>
              <p className="text-neutral-300">To request a refund:</p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>
                  Contact our customer service team via email or phone at
                  churlee12@gmail.com or 4709192464.
                </li>

                <li>Provide your purchase details and reason for refund</li>
                <li>Refunds will be processed within 5-7 business days</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl">Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300">
                You can cancel your subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>
                  Your subscription will remain active until the end of your
                  current billing period
                </li>
                <li>You will not be charged for the next billing cycle</li>
                <li>
                  No partial refunds are provided for unused portions of the
                  current billing period
                </li>
                <li>
                  You can continue using the service until the end of your
                  current billing period
                </li>
              </ul>
              <p className="text-neutral-300 mt-4">
                To cancel your subscription, go to the settings page.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300">
                Our service is priced at $20 USD per month. The subscription
                includes:
              </p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>Full access to Interview Coder software</li>
                <li>Automatic updates and new features</li>
                <li>Customer support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
