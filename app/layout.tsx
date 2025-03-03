import "./globals.css"
import { Inter } from "next/font/google"
import { ReactQueryProvider } from "@/lib/react-query/provider"
import { Analytics } from "@vercel/analytics/react"
import mixpanel from 'mixpanel-browser'
import Script from 'next/script'

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
      <head>
        {/* First Promoter tracking script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w){w.fpr=w.fpr||function(){w.fpr.q = w.fpr.q||[];w.fpr.q[arguments[0]=='set'?'unshift':'push'](arguments);};})(window);
              fpr("init", {cid:"4z8yt1oa"}); fpr("click");
            `
          }}
        />
        <script src="https://cdn.firstpromoter.com/fpr.js" async></script>
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
