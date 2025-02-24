"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  Monitor,
  Brain,
  MousePointer,
  Command,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

// Create motion components
const MotionDiv = motion.div

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

const ScreenshareAnimation = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/50">
      <MotionDiv
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: [1, 1, 2, 2, 1, 1],
          x: ["0%", "0%", "-25%", "-25%", "0%", "0%"],
          y: ["0%", "0%", "25%", "25%", "0%", "0%"]
        }}
        transition={{
          duration: 8,
          times: [0, 0.3, 0.4, 0.6, 0.7, 1],
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full"
      >
        <img
          src="/undetectability/screenshare.png"
          alt="Screen sharing"
          className="w-full"
        />
      </MotionDiv>
    </div>
  )
}

const ThoughtsImage = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/50">
      <img
        src="/undetectability/thoughts.png"
        alt="Solution reasoning"
        className="w-full"
      />
    </div>
  )
}

const WebcamVideo = () => {
  return (
    <div className="relative w-full rounded-lg border border-white/10 bg-black/50">
      <video autoPlay loop muted playsInline className="w-full">
        <source src="/undetectability/webcam.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

const ActiveTabVideo = () => {
  return (
    <div className="relative w-full rounded-lg border border-white/10 bg-black/50">
      <video autoPlay loop muted playsInline className="w-full">
        <source src="/undetectability/active.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

const FeatureCard = ({
  icon,
  title,
  description,
  className
}: FeatureCardProps) => {
  return (
    <Link href="/help?section=undetectability">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 hover:border-[#FFFF00]/50 transition-colors cursor-pointer",
          className
        )}
      >
        {/* Content Section */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div
            className={cn(
              "mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              "bg-[#FFFF00]/10 text-[#FFFF00]",
              "group-hover:bg-[#FFFF00]/20"
            )}
          >
            {icon}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <MotionDiv
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="group-hover:opacity-100 transition-all duration-200"
            >
              <ArrowRight className="w-4 h-4 text-[#FFFF00]" />
            </MotionDiv>
          </div>
          <p className="text-sm leading-6 text-gray-400">{description}</p>
        </div>

        {/* Demo Section */}
        <div className="relative z-10 bg-black/30 p-4">
          {title === "Screen Sharing Detection" ? (
            <ScreenshareAnimation />
          ) : title === "Solution Reasoning" ? (
            <ThoughtsImage />
          ) : title === "Webcam Monitoring" ||
            title === "Active Tab Detection" ? (
            <div className="w-full">
              {title === "Webcam Monitoring" ? (
                <WebcamVideo />
              ) : (
                <ActiveTabVideo />
              )}
            </div>
          ) : (
            <div className="h-[120px] w-full rounded-lg border border-white/10 bg-black/50">
              {/* Placeholder for your video */}
              <div className="w-full h-full flex items-center justify-center text-[#FFFF00]/50 text-xs">
                Demo Video
              </div>
            </div>
          )}
        </div>

        <div className="absolute -inset-4 z-0 transform-gpu blur-3xl transition-all group-hover:opacity-50 group-hover:blur-2xl bg-gradient-to-br from-[#FFFF00]/20 via-transparent to-transparent opacity-0" />
      </MotionDiv>
    </Link>
  )
}

const GlowingLine = () => (
  <div className="relative w-full max-w-[400px] mx-auto h-[40px] mb-8">
    {/* Left line container */}
    <div className="absolute left-0 top-[25px] w-[40%] sm:w-[160px] overflow-hidden">
      <MotionDiv
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-[2px] bg-gradient-to-l to-transparent from-[#FFFF00] to-90%"
      />
    </div>

    {/* Right line container */}
    <div className="absolute right-0 top-[25px] w-[40%] sm:w-[160px] overflow-hidden">
      <MotionDiv
        initial={{ x: "100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-[2px] bg-gradient-to-r to-transparent from-[#FFFF00] to-90%"
      />
    </div>

    {/* Extra glow layer for center */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[25px] w-[40px] h-[2px] bg-[#FFFF00] blur-[4px]" />

    {/* Undetectable text with glow */}
    <div className="absolute left-1/2 -translate-x-1/2 top-0">
      <div className="relative">
        <div className="absolute -inset-1 bg-[#FFFF00]/30 blur-[10px]" />
        <div
          className="relative text-lg sm:text-xl tracking-[0.2em] font-light text-[#FFFF00]"
          style={{
            textShadow: "0 0 10px #FFFF00, 0 0 20px rgba(255, 255, 0, 0.5)"
          }}
        >
          PRO
        </div>
      </div>
    </div>
  </div>
)

// Demo components
const ScreenSharingDemo = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative h-[300px] rounded-xl bg-zinc-900/50 border border-white/10 p-6"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="relative inline-block">
          <div className="relative z-10 bg-zinc-800 rounded-lg p-4 border border-white/10">
            <pre className="text-sm text-gray-300">
              console.log("Hello World!");
            </pre>
          </div>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-[#FFFF00]/10 blur-xl"
          />
        </div>
        <p className="text-sm text-gray-400">
          Your solution remains invisible during screen sharing
        </p>
      </div>
    </div>
  </MotionDiv>
)

const WebcamDemo = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative h-[300px] rounded-xl bg-zinc-900/50 border border-white/10 p-6"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="space-y-4">
        <MotionDiv
          className="bg-zinc-800 rounded-lg p-4 border border-white/10"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Command className="w-8 h-8 text-[#FFFF00]" />
        </MotionDiv>
        <p className="text-sm text-center text-gray-400">
          Move the window with ⌘ + arrow keys
        </p>
      </div>
    </div>
  </MotionDiv>
)

const TabDemo = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative h-[300px] rounded-xl bg-zinc-900/50 border border-white/10 p-6"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="space-y-4">
        <MotionDiv
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-zinc-800 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFFF00]" />
            <span className="text-sm text-gray-300">Active Tab Maintained</span>
          </div>
        </MotionDiv>
        <p className="text-sm text-center text-gray-400">
          Toggle visibility while keeping focus
        </p>
      </div>
    </div>
  </MotionDiv>
)

const ReasoningDemo = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative h-[300px] rounded-xl bg-zinc-900/50 border border-white/10 p-6 overflow-hidden"
  >
    <MotionDiv
      animate={{ y: [-200, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="space-y-4"
    >
      <div className="bg-zinc-800 rounded-lg p-4 border border-white/10">
        <pre className="text-xs text-[#FFFF00]">
          // First, we initialize our dynamic programming array
        </pre>
        <pre className="text-xs text-gray-300">
          const dp = new Array(n + 1).fill(0);
        </pre>
      </div>
      <div className="bg-zinc-800 rounded-lg p-4 border border-white/10">
        <pre className="text-xs text-[#FFFF00]">
          // Base cases for the first two numbers
        </pre>
        <pre className="text-xs text-gray-300">dp[1] = 1;</pre>
        <pre className="text-xs text-gray-300">dp[2] = 2;</pre>
      </div>
      <div className="bg-zinc-800 rounded-lg p-4 border border-white/10">
        <pre className="text-xs text-[#FFFF00]">
          // For each step, we can either take 1 or 2 steps
        </pre>
        <pre className="text-xs text-gray-300">
          {"for (let i = 3; i <= n; i++) {"}
        </pre>
        <pre className="text-xs text-gray-300"> dp[i] = dp[i-1] + dp[i-2];</pre>
        <pre className="text-xs text-gray-300">{"}"}</pre>
      </div>
    </MotionDiv>
  </MotionDiv>
)

const UndetectabilitySection = () => {
  const [activeDemo, setActiveDemo] = useState<string>("screen")

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <GlowingLine />
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight white-gradient sm:text-3xl">
            How is it undetectable?
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#999999]">
            Interview Coder has the most robust undetectability features on the
            planet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FeatureCard
            icon={<Monitor className="w-6 h-6" />}
            title="Screen Sharing Detection"
            description="Our app is completely invisible to screen sharing software and screenshots on platforms like Zoom, Google Meet, Hackerrank, and Coderpad."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grid-rows-1">
            <div className="h-full">
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="Solution Reasoning"
                description="Every line of code comes with detailed comments and natural thought process explanations, helping you articulate your solution approach convincingly."
                className="h-full"
              />
            </div>

            <div className="h-full">
              <FeatureCard
                icon={<Eye className="w-6 h-6" />}
                title="Webcam Monitoring"
                description="Use ⌘ + arrow keys to move the app over your coding area, keeping your eyes naturally focused on the screen during webcam monitoring."
                className="h-full"
              />
            </div>
          </div>

          <FeatureCard
            icon={<MousePointer className="w-6 h-6" />}
            title="Active Tab Detection"
            description="Toggle visibility with ⌘ + B while maintaining cursor focus and active tab state, making it undetectable by platform monitoring."
          />
        </div>
      </div>
    </section>
  )
}

export default UndetectabilitySection
