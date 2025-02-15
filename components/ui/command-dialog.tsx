import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// This type represents a search result
interface SearchResult {
  sectionId: string
  sectionTitle: string
  matchingText: string
  groupTitle: string
}

// Help sections data structure
const HELP_SECTIONS = [
  {
    title: "General",
    items: [
      {
        id: "getting-started",
        title: "Getting Started",
        fullText: `Welcome to Interview Coder. This guide will help you get up and running quickly.

Quick Start Steps
• Install the Interview Coder app in the download link below (MacOS only)
• Move the app into your Applications folder
• Sign up for an account or log in on the InterviewCoder website
• Open the app and log in with your account
• Configure your preferences in the settings page
• Start shitting on your technicals!`
      },
      {
        id: "configuration",
        title: "Language Configuration",
        fullText: `Customize Interview Coder to match your needs and preferences.

Application Settings
You can manage your language preferences in the settings page.
Currently, we offer support for Python, Java, Javascript, Go, C++, Kotlin, and Swift.`
      },
      {
        id: "undetectability",
        title: "Undetectability",
        fullText: `Learn how Interview Coder remains completely undetectable during interviews.

Coding interview platforms employ various detection methods to prevent cheating. Here's how they try to detect tools like Interview Coder, and how we counter each measure.

Interview Coder has never been detected in our real interview tests by any coding platform.`
      }
    ]
  },
  {
    title: "Account and Subscription",
    items: [
      {
        id: "cancel-subscription",
        title: "Cancel Subscription",
        fullText: `Learn how to cancel your Interview Coder subscription.

How to Cancel
You can cancel your subscription anytime from the settings page. After cancellation:

• Your subscription will remain active until the end of your current billing period
• You won't be charged again after cancellation
• You can continue using all features until your subscription expires`
      },
      {
        id: "refund-policy",
        title: "Refund Policy",
        fullText: `Learn about our money-back guarantee and refund process.

We offer a 24-hour refund policy for our software subscription ONLY in the condition that you are able to show video evidence that it is not working on your computer. Concerns like detection by screen-sharing software, or slowness in solution generation are not refundable.`
      }
    ]
  },
  {
    title: "Troubleshooting",
    items: [
      {
        id: "out-of-credits",
        title: "Says out of credits",
        fullText: `Troubleshoot and resolve credit-related issues.

Quick Fix
Press ⌘ Q on the application to close the app, and reopen it.

Other Reasons
• Your subscription has expired
• You've used all available credits for the month`
      },
      {
        id: "cant-see-screen",
        title: "Can't see screen",
        fullText: `Follow these steps to resolve screen visibility issues.

Troubleshooting Steps
1. Press ⌘ + B to toggle visibility
2. Uninstall and reinstall the app`
      },
      {
        id: "shows-when-sharing",
        title: "Shows when I share screen",
        content: "Resolve screen sharing visibility problems"
      }
    ]
  }
]

function getContextAroundMatch(
  text: string | undefined,
  searchTerm: string
): string {
  if (!text || !searchTerm) return ""

  const searchTermLower = searchTerm.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(searchTermLower)

  if (index === -1) return text.slice(0, 150)

  const contextLength = 100
  const start = Math.max(0, index - contextLength)
  const end = Math.min(text.length, index + searchTerm.length + contextLength)

  let result = text.slice(start, end)
  if (start > 0) result = "..." + result
  if (end < text.length) result = result + "..."

  return result
}

function highlightMatches(
  text: string | undefined,
  searchTerm: string
): string {
  if (!text || !searchTerm) return text || ""

  const searchTermLower = searchTerm.toLowerCase()
  const regex = new RegExp(searchTermLower, "gi")

  return text.replace(
    regex,
    (match) =>
      `<mark class="bg-primary/20 text-primary font-medium rounded-sm px-0.5">${match}</mark>`
  )
}

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandDialog({ open, onOpenChange }: CommandDialogProps) {
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setSelectedIndex(-1)

    if (!value) {
      setSearchResults([])
      return
    }

    if (value.length < 3) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []
    const searchTermLower = value.toLowerCase()

    HELP_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        const fullText = item.fullText || item.content || ""
        const titleLower = item.title.toLowerCase()
        const textLower = fullText.toLowerCase()

        if (
          titleLower.includes(searchTermLower) ||
          textLower.includes(searchTermLower)
        ) {
          const matchingText = getContextAroundMatch(fullText, value)
          results.push({
            sectionId: item.id,
            sectionTitle: item.title,
            matchingText,
            groupTitle: section.title
          })
        }
      })
    })

    setSearchResults(results)
  }

  const handleSelect = (sectionId: string) => {
    onOpenChange(false)
    router.push(`/help?section=${sectionId}`)

    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 80
        const top =
          element.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top, behavior: "smooth" })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[calc(100vw-32px)] mx-auto p-0 overflow-hidden bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80 rounded-xl border border-white/5 shadow-2xl">
        <DialogTitle className="sr-only">Search Documentation</DialogTitle>
        <div className="flex flex-col w-full">
          {/* Search Input */}
          <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-white/5">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-sm text-zinc-100 placeholder:text-zinc-500"
            />
            <div className="hidden sm:flex gap-1 flex-shrink-0">
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] leading-none text-zinc-400">
                ⌘
              </span>
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] leading-none text-zinc-400">
                K
              </span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[min(400px,70vh)] overflow-y-auto p-1.5 sm:p-2">
            {searchTerm.length === 0 ? (
              <div className="py-4 sm:py-6 text-center text-[13px] sm:text-sm text-zinc-500">
                Start typing to search...
              </div>
            ) : searchTerm.length < 3 ? (
              <div className="py-4 sm:py-6 text-center text-[13px] sm:text-sm text-zinc-500">
                Type at least 3 characters to search...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-4 sm:py-6 text-center text-[13px] sm:text-sm text-zinc-500">
                No results found.
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-[11px] sm:text-xs font-medium text-zinc-500">
                  Search Results
                </div>
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.sectionId}-${index}`}
                      onClick={() => handleSelect(result.sectionId)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full text-left px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg 
                        transition-all duration-200 
                        hover:bg-zinc-800/70 
                        ${selectedIndex === index ? "bg-zinc-800/70" : ""}
                        outline-none focus:outline-none
                        cursor-pointer
                      `}
                    >
                      <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className="font-medium text-[13px] sm:text-sm text-zinc-200"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatches(
                                result.sectionTitle,
                                searchTerm
                              )
                            }}
                          />
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 px-1.5 py-0.5 rounded-full bg-zinc-800/50">
                            {result.groupTitle}
                          </div>
                        </div>
                        <div
                          className="text-[12px] sm:text-[13px] text-zinc-400 leading-relaxed line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(
                              result.matchingText,
                              searchTerm
                            )
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
