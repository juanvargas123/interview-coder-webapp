"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

import { HowToUseHeader } from "./HowToUseHeader"
import ApiKey from "../ui/steps/apiKey"
import Queue from "../ui/steps/Queue"
import SolutionsView from "../ui/steps/SolutionsView"
import DebugView from "../ui/steps/DebugView"

const steps = [
  {
    id: "api-key",
    subtitle: "Get Started",
    title: "Login and subscribe to Interview Coder",
    description:
      "You'll need a funded OpenAI API key to use Interview Coder. Your key is never stored and is only used on your computer."
  },
  {
    id: "interview",
    subtitle: "Capture the Problem",
    title: "Start taking screenshots",
    description:
      "Use ⌘ + H to capture the problem. Up to 5 screenshots will be saved and shown on the application."
  },
  {
    id: "solutions",
    subtitle: "Solve",
    title: "Get your solutions",
    description:
      "Once you've captured your screenshots, press ⌘ + ↵ to generate solutions. We'll analyze the problem and provide a solution with detailed explanations."
  },
  {
    id: "debug",
    subtitle: "Debug and Optimize",
    title: "Debug your solutions",
    description:
      "If the solutions are incorrect or you need an optimization, take extra screenshots of your code with ⌘ + H. Press ⌘ + ↵ again and we'll debug and optimize your code, with before and after comparisons."
  }
]

export const StepsSection = () => {
  const [pathCoords, setPathCoords] = useState({ x1: 90, x2: 95 })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setPathCoords({
        x1: width < 1200 ? 70 : 90,
        x2: width < 1200 ? 75 : 95
      })
    }

    handleResize() // Initial call
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleApiKeySubmit = (apiKey: string) => {
    // Handle API key submission
    console.log("API key submitted")
  }

  return (
    <>
      <HowToUseHeader />

      <section className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className={`py-6 lg:py-32`}>
            <div className="max-w-none mx-auto px-6">
              <div
                className={`lg:ml-[10%] relative h-fit ${
                  index === 3
                    ? "lg:bg-gradient-to-br lg:from-gray-900/50 lg:via-gray-900/30 lg:to-black/50 lg:backdrop-blur-xl lg:rounded-xl lg:p-12 lg:pt-16 lg:pb-16 lg:border lg:border-white/[0.08] lg:shadow-[0_0_1px_1px_rgba(0,0,0,0.3)] lg:backdrop-saturate-150"
                    : ""
                }`}
              >
                {/* Timelines */}
                {index === 0 && (
                  <>
                    {/* 1) SVG version for lg and above */}
                    <div className="absolute -left-[9%] w-[60%] top-24 -bottom-28 hidden lg:block">
                      <motion.svg
                        className="h-[150%] w-[95%]"
                        viewBox="0 0 100 80"
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* --- 1) DEFINES FOR GRADIENT + GLOW FILTER --- */}
                        <defs>
                          <linearGradient
                            id="verticalGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="transparent" />
                            <stop
                              offset="50%"
                              stopColor="#FFD700"
                              stopOpacity="0.8"
                            />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>

                          <filter
                            id="glow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            {/* Gaussian blur for a glowing/blurred look */}
                            <feGaussianBlur
                              in="SourceGraphic"
                              stdDeviation="2"
                              result="blur"
                            />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* --- 2) MAIN GRADIENT STROKE (ANIMATED) --- */}
                        <motion.path
                          d={`M 0 0 V 40 L 10 50 L ${pathCoords.x1} 50 L ${pathCoords.x2} 60 L ${pathCoords.x2} 80`}
                          stroke="url(#verticalGradient)"
                          strokeWidth="0.15"
                          filter="url(#glow)"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />

                        {/* --- 3) FAINT YELLOW BEHIND-PATH FOR EXTRA BLUR LAYER --- */}
                        <motion.path
                          d={`M 0 0 V 40 L 10 50 L ${pathCoords.x1} 50 L ${pathCoords.x2} 60 L ${pathCoords.x2} 80`}
                          stroke="#FFD700"
                          strokeWidth="1"
                          strokeOpacity="0.01"
                          filter="url(#glow)"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </motion.svg>
                    </div>

                    {/* 2) Old multi-div version for smaller screens */}
                    <div className="absolute -left-[10%] -top-20 bottom-0">
                      <motion.div
                        initial={{ height: "0%" }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#FFD700]/40 to-transparent"
                      />
                      <div className="absolute w-[2px] h-full bg-[#FFD700]/20 blur-[4px]" />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="absolute top-[45%] -left-[6px]"
                      >
                        <div className="relative">
                          <div className="absolute h-4 w-4 -left-[1px] -top-[1px] bg-[#FFD700]/30 rounded-full blur-[10px]" />
                          <div
                            className="h-3 w-3 bg-[#FFD700] rounded-full relative"
                            style={{
                              boxShadow:
                                "0 0 10px #FFD700, 0 0 20px rgba(255,215,0,0.5)"
                            }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Second Timeline (inside card) */}
                {index === 1 && (
                  <div className="absolute -left-[10%] lg:left-[43%] lg:-translate-x-1/2 -top-20 bottom-0">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                      className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#4F46E5]/40 to-transparent"
                    />
                    <div className="absolute w-[2px] h-full bg-[#4F46E5]/20 blur-[4px]" />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute top-[45%] -left-[6px]"
                    >
                      <div className="relative">
                        <div className="absolute h-4 w-4 -left-[1px] -top-[1px] bg-[#4F46E5]/30 rounded-full blur-[10px]" />
                        <div
                          className="h-3 w-3 bg-[#4F46E5] rounded-full relative"
                          style={{
                            boxShadow:
                              "0 0 10px #4F46E5, 0 0 20px rgba(79, 70, 229, 0.5)"
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Third Timeline */}
                {index === 2 && (
                  <div className="absolute -left-[10%] -top-20 bottom-0">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#10B981]/40 to-transparent"
                    />
                    <div className="absolute w-[2px] h-full bg-[#10B981]/20 blur-[4px]" />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute top-[45%] -left-[6px]"
                    >
                      <div className="relative">
                        <div className="absolute h-4 w-4 -left-[1px] -top-[1px] bg-[#10B981]/30 rounded-full blur-[10px]" />
                        <div
                          className="h-3 w-3 bg-[#10B981] rounded-full relative"
                          style={{
                            boxShadow:
                              "0 0 10px #10B981, 0 0 20px rgba(16, 185, 129, 0.5)"
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Fourth Timeline */}
                {index === 3 && (
                  <div className="absolute -left-[10%] lg:left-6 -top-20 lg:top-12 bottom-0 lg:bottom-12">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#8B5CF6]/40 to-transparent"
                    />
                    <div className="absolute w-[2px] h-full bg-[#8B5CF6]/20 blur-[4px]" />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute top-[45%] -left-[6px]"
                    >
                      <div className="relative">
                        <div className="absolute h-4 w-4 -left-[1px] -top-[1px] bg-[#8B5CF6]/30 rounded-full blur-[10px]" />
                        <div
                          className="h-3 w-3 bg-[#8B5CF6] rounded-full relative"
                          style={{
                            boxShadow:
                              "0 0 10px #8B5CF6, 0 0 20px rgba(139, 92, 246, 0.5)"
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                <div
                  className={`grid grid-cols-1 gap-12 ${
                    index !== 2 && index !== 3
                      ? "lg:grid-cols-2 lg:items-center"
                      : ""
                  } justify-left`}
                >
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className={index === 1 ? "lg:order-2 lg:pl-12" : ""}
                  >
                    <div
                      className={`${index === 3 ? "lg:ml-6" : ""} ${
                        index === 2 || index === 3 ? "max-w-[100%]" : ""
                      }`}
                    >
                      <div
                        className={`text-xl font-medium mb-4 ${
                          index === 1
                            ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text"
                            : index === 2
                            ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-transparent bg-clip-text"
                            : index === 3
                            ? "bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-transparent bg-clip-text"
                            : "bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-transparent bg-clip-text"
                        }`}
                      >
                        {step.subtitle}
                      </div>
                      <h2
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 py-2
                          index === 2 || index === 3
                            ? "max-w-full"
                            : "max-w-[800px]"
                        } ${index === 1 ? "lg:pr-12" : ""} ${
                          index === 3 ? "leading-[1.6]" : "leading-[1.1]"
                        }`}
                      >
                        {step.title}
                      </h2>
                      <p
                        className={`text-gray-400 text-xl mb-8 ${
                          index === 2 ? "w-full" : "max-w-2xl"
                        }`}
                      >
                        {step.description}
                      </p>
                      {index === 0 && (
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white inline-flex items-center hover:opacity-80 transition-all group"
                        >
                          <span className="bg-gradient-to-r from-[#FFD700] to-[#FFC000] bg-clip-text text-transparent text-lg">
                            Get an API Key
                          </span>
                          <svg
                            className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>

                  {/* Visual Component */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className={`relative ${
                      index === 1
                        ? "lg:order-1 w-full max-w-[100vw] lg:-ml-[10%] overflow-hidden"
                        : "w-full"
                    } ${index === 2 ? "col-span-1" : ""} ${
                      index === 3
                        ? "backdrop-blur-sm rounded-lg overflow-hidden"
                        : ""
                    }`}
                  >
                    {index === 0 ? (
                      <ApiKey />
                    ) : index === 1 ? (
                      <Queue />
                    ) : index === 2 ? (
                      <SolutionsView />
                    ) : (
                      <DebugView />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
