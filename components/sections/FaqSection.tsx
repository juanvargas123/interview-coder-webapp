import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { FlipWords } from "../ui/flip-words"
import Link from "next/link"

const words = ["kill Leetcode", "fix Technical", "change Coding"]
const faqs = [
  {
    question: "Is Interview Coder free?",
    answer:
      "Yes, we only ask you to fund your Open AI API key, which we make no money off of. Our goal is to change the way companies conduct technical interviews, not to make a buck. "
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
    answer: "Python."
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
      <div className="container px-4 mx-auto max-w-6xl">
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
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-12">
            Help us <FlipWords words={words} />
            interviews.
          </h2>
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-black gap-2 text-xl font-semibold px-12 h-14 w-[280px] md:w-[320px]">
                  <Image
                    src="/apple.svg"
                    alt="Apple"
                    width={16}
                    height={16}
                    className="w-6 h-6"
                  />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[280px] md:w-[320px] bg-black border-[#800020]/20"
              >
                <DropdownMenuItem
                  asChild
                  className="py-3 cursor-pointer text-base"
                >
                  <Link href="https://github.com/ibttf/interview-coder/releases/download/v1.0.3/Interview.Coder-1.0.0-arm64.dmg">
                    Download for Intel Mac
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="py-3 cursor-pointer text-base"
                >
                  <Link href="https://github.com/ibttf/interview-coder/releases/download/v1.0.3/Interview.Coder-1.0.0-arm64.dmg">
                    Download for Silicon Mac
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  )
}
