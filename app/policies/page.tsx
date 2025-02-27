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
                We offer a 24-hour refund policy for our software subscription
                ONLY in the condition that you are able to show video evidence
                that it is not working on your computer. Concerns like{" "}
                <a
                  href="/help?section=shows-when-sharing"
                  className="underline"
                >
                  detection by screen-sharing software
                </a>
                , or slowness in solution generation are not refundable.
              </p>
              <p className="text-neutral-300">To request a refund:</p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>
                  Contact our customer service team via email or phone at
                  churlee12@gmail.com or 4709192464.
                </li>

                <li>
                  Provide your purchase details, reason for refund, and video
                  evidence of the software not working.
                </li>
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
                Our service is priced at $60 USD per month. The subscription
                includes:
              </p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>Full access to Interview Coder software</li>
                <li>Automatic updates and new features</li>
                <li>Customer support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-2xl">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300">
                By using Interview Coder, you agree to these terms of service:
              </p>
              <ul className="list-disc pl-6 text-neutral-300 space-y-2">
                <li>
                  <strong>License:</strong> We grant you a limited,
                  non-exclusive, non-transferable license to use Interview Coder
                  for your personal coding interview preparation. This tool is
                  NOT intended to be used in a real interview. The purpose of
                  the tool is purely illustrative and all of our marketing
                  efforts are for the purpose of showing big tech companies how
                  easy it would be to game their broken interview processes.
                </li>
                <li>
                  <strong>User Conduct:</strong> You agree not to:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Share your account credentials with others</li>
                    <li>Attempt to reverse engineer the software</li>
                    <li>Use the service for any illegal purposes</li>
                    <li>Interfere with or disrupt the service</li>
                  </ul>
                </li>
                <li>
                  <strong>Content Rights:</strong> All content generated using
                  our service is owned by you, but the software, branding, and
                  infrastructure remain our intellectual property.
                </li>
                <li>
                  <strong>Service Changes:</strong> We reserve the right to
                  modify, suspend, or discontinue any part of the service with
                  reasonable notice.
                </li>
                <li>
                  <strong>Liability:</strong> The service is provided "as is"
                  without warranties of any kind, either express or implied.
                </li>
              </ul>
              <p className="text-neutral-300 mt-4">
                These terms may be updated periodically. Continued use of the
                service constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
