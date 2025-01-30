import { AnimatedKeyboard } from "@/components/ui/AnimatedKeyboard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const words = ["kill Leetcode", "fix Technical", "change Coding"]
const faqs = [
  {
    question: "Is Interview Coder free?",
    answer:
      "No, it's $20 a month. In exchange, you get access to the absolute latest models, including o1, Claude, and Deepseek."
  },
  {
    question: "How is it undetectable?",
    answer: `
      <div>
        Our software is designed to be completely undetectable to interviewers:
        <ul class="list-none space-y-2 mt-2">
          <li>• Invisible to Zoom (≤6.16) and any browser-based screen recording software</li>
          <li>• Undetectable global keyboard commands that can't be detected as input by the browser</li>
          <li>• Thoughts to read aloud that sound human and can explain your process</li>
          <li>• Moveable screen using cmd + arrow keys so your eyes aren't looking away from the solution as you write your code.</li>
        </ul>
        <div class="mt-4">
          <a target="_blank" href="https://www.linkedin.com/posts/neel-shanmugam_technical-interviews-for-software-engineering-activity-7275781351046299648-tCRy?utm_source=share&utm_medium=member_desktop">
            <span class="underline">Here</span>'s a demo.
          </a>
        </div>
        </div>
      </div>
    `
  },
  {
    question: "Is it suitable for all skill levels?",
    answer: "Yes."
  },
  {
    question: "What programming languages are supported?",
    answer:
      "Python, Golang, Java, and Javascript. You can edit your preferred langauge in the app or in your settings."
  },
  ,
  {
    question: "I'm experiencing a bug, what should I do",
    answer:
      "9 times out of 10, you can uninstall and reinstall the app from this website. If that doesn't work, please email us at <a href='mailto:churlee12@gmail.com'>churlee12@gmail.com</a> and we'll get back to you within 24 hours."
  }
]

function FaqItem({
  question,
  answer,
  isOpen,
  onClick
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={false}
      className={cn(
        "border-b border-neutral-700/40 last:border-none",
        isOpen ? "bg-neutral-900/50" : ""
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 px-5 text-left"
      >
        <span className="text-lg font-medium text-neutral-200">{question}</span>
        <span
          className={cn(
            "ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700/50",
            isOpen ? "bg-neutral-700" : "bg-transparent"
          )}
        >
          <svg
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="pb-4 px-5 text-neutral-400"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="white-gradient font-inter">Common Questions</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Everything you need to know about Interview Coder.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-neutral-700/40 divide-y divide-neutral-700/40 bg-neutral-900/20 backdrop-blur-sm">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="max-w-xs mx-auto my-24">
          <div className="h-px bg-neutral-800" />
        </div>

        {/* Call to Action */}
        <div className="text-center ">
          <div className="relative w-full h-[600px] lg:h-[800px]">
            <AnimatedKeyboard />
          </div>
          <div className="">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Take the short way.
              </h2>
              <p className="text-neutral-400">
                Download and use Interview Coder today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="text-black gap-2 text-sm font-medium h-10 w-[280px] md:w-[320px] bg-primary hover:bg-primary/90">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/apple.svg"
                        alt="Apple"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Download for Mac
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href="https://github.com/ibttf/interview-coder/releases/download/v1.0.8/Interview-Coder-arm64.dmg"
                      className="w-full"
                    >
                      Download for Mac (Apple Silicon)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://github.com/ibttf/interview-coder/releases/download/v1.0.8/Interview-Coder-x64.dmg"
                      className="w-full"
                    >
                      Download for Mac (Intel)
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="gap-2 text-sm font-medium h-10 w-[280px] md:w-[320px] border-neutral-700 hover:bg-neutral-800"
              >
                <Link href="/waitlist" className="flex items-center gap-2">
                  <Image
                    src="/windows.svg"
                    alt="Windows"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  Join Windows waitlist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
