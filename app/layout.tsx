import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const font = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: "Interview Coder",
  description: "Never fail a Leetcode interview again."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${font.variable}`}>
      <body className="min-h-screen bg-background antialiased max-w-screen overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  )
}
