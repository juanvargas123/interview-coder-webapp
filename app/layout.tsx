import "./globals.css"
import { Inter } from "next/font/google"
import { ReactQueryProvider } from "@/lib/react-query/provider"
import { Analytics } from "@vercel/analytics/react"
import mixpanel from 'mixpanel-browser'

const inter = Inter({ subsets: ["latin"] })

// Initialize Mixpanel as early as possible
if (typeof window !== 'undefined') {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage'
  });
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
