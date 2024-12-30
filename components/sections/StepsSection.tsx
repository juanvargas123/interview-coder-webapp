"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { HowToUseHeader } from "./HowToUseHeader"
import ApiKey from "../ui/steps/apiKey"
import Queue from "../ui/steps/Queue"
import SolutionsView from "../ui/steps/SolutionsView"
import DebugView from "../ui/steps/DebugView"

const steps = [
  {
    id: "api-key",
    subtitle: "Get Started",
    title: "Enter your OpenAI API key",
    description:
      "You'll need a funded OpenAI API key to use Interview Coder. Your key is never stored and is only used on your computer."
  },
  {
    id: "interview",
    subtitle: "Get Started",
    title: "Start taking screenshots",
    description:
      "Use cmd + h to capture the problem. Up to 5 screenshots will be saved and shown on the application."
  },
  {
    id: "solutions",
    subtitle: "Get Started",
    title: "Process your solutions",
    description:
      "Once you've captured your screenshots, press cmd + return to generate solutions. We'll analyze the problem and provide detailed explanations."
  },
  {
    id: "debug",
    subtitle: "Get Started",
    title: "Debug your solutions",
    description:
      "If the solutions are incorrect or you need an optimization, take extra screenshots of your code with cmd + h. Press cmd + return again and we'll debug and optimize your code, with before and after comparisons."
  }
]

export const StepsSection = () => {
  const handleApiKeySubmit = (apiKey: string) => {
    // Handle API key submission
    console.log("API key submitted")
  }

  return (
    <>
      <HowToUseHeader />

      <section className="relative">
        {/* First Timeline */}
        <div className="absolute left-[5%] top-0 h-[30%]">
          {/* Main vertical line */}
          <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#FF1A1A]/30 to-transparent" />
          {/* Glowing line overlay */}
          <div className="absolute w-[2px] h-full bg-[#FF1A1A]/20 blur-[4px]" />
          {/* Dot */}
          <div className="absolute h-4 w-4 -left-[7px] top-[45%] bg-[#FF1A1A]/30 rounded-full blur-[10px]" />
          <div
            className="absolute h-3 w-3 -left-[6px] top-[45%] bg-[#FF1A1A] rounded-full"
            style={{
              boxShadow: `
                0 0 10px #FF1A1A,
                0 0 20px rgba(255, 26, 26, 0.5)
              `
            }}
          />
          {/* Top fade */}
          <div className="absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-black to-transparent" />
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="py-32">
            <div className="max-w-[1400px] mx-auto px-6">
              <div
                className={`ml-[10%] relative ${
                  index === 1 || index === 3
                    ? "bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 backdrop-blur-sm rounded-xl p-12 border border-white/10"
                    : ""
                }`}
              >
                {/* Second Timeline (inside card) */}
                {index === 1 && (
                  <div className="absolute left-6 top-12 bottom-12">
                    {/* Main vertical line */}
                    <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#4F46E5]/40 to-transparent" />
                    {/* Glowing line overlay */}
                    <div className="absolute w-[2px] h-full bg-[#4F46E5]/30 blur-[4px]" />
                    {/* Dot */}
                    <div className="absolute h-4 w-4 -left-[7px] top-[45%] bg-[#4F46E5]/30 rounded-full blur-[10px]" />
                    <div
                      className="absolute h-3 w-3 -left-[6px] top-[45%] bg-[#4F46E5] rounded-full"
                      style={{
                        boxShadow: `
                          0 0 10px #4F46E5,
                          0 0 20px rgba(79, 70, 229, 0.5)
                        `
                      }}
                    />
                  </div>
                )}

                {/* Third Timeline */}
                {index === 2 && (
                  <div className="absolute -left-[5%] -top-20 bottom-0">
                    {/* Main vertical line */}
                    <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#10B981]/40 to-transparent" />
                    {/* Glowing line overlay */}
                    <div className="absolute w-[2px] h-full bg-[#10B981]/30 blur-[4px]" />
                    {/* Dot */}
                    <div className="absolute h-4 w-4 -left-[7px] top-[45%] bg-[#10B981]/30 rounded-full blur-[10px]" />
                    <div
                      className="absolute h-3 w-3 -left-[6px] top-[45%] bg-[#10B981] rounded-full"
                      style={{
                        boxShadow: `
                          0 0 10px #10B981,
                          0 0 20px rgba(16, 185, 129, 0.5)
                        `
                      }}
                    />
                  </div>
                )}

                {/* Fourth Timeline (inside card) */}
                {index === 3 && (
                  <div className="absolute left-6 top-12 bottom-12">
                    {/* Main vertical line */}
                    <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#8B5CF6]/40 to-transparent" />
                    {/* Glowing line overlay */}
                    <div className="absolute w-[2px] h-full bg-[#8B5CF6]/30 blur-[4px]" />
                    {/* Dot */}
                    <div className="absolute h-4 w-4 -left-[7px] top-[45%] bg-[#8B5CF6]/30 rounded-full blur-[10px]" />
                    <div
                      className="absolute h-3 w-3 -left-[6px] top-[45%] bg-[#8B5CF6] rounded-full"
                      style={{
                        boxShadow: `
                          0 0 10px #8B5CF6,
                          0 0 20px rgba(139, 92, 246, 0.5)
                        `
                      }}
                    />
                  </div>
                )}

                <div
                  className={`grid grid-cols-1 ${
                    index !== 2 && index !== 3 ? "lg:grid-cols-2" : ""
                  } gap-16 items-center`}
                >
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div
                      className={`${index === 1 ? "ml-12" : ""} ${
                        index === 2 || index === 3 ? "max-w-[80%]" : ""
                      }`}
                    >
                      <div
                        className={`text-xl font-medium mb-4 ${
                          index === 1
                            ? "text-[#4F46E5]"
                            : index === 2
                            ? "text-[#10B981]"
                            : index === 3
                            ? "text-[#8B5CF6]"
                            : "text-[#FF1A1A]"
                        }`}
                      >
                        {step.subtitle}
                      </div>
                      <h2
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.1] ${
                          index === 2 ? "max-w-full" : ""
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
                          className="text-white inline-flex items-center hover:opacity-80 transition-opacity text-lg"
                        >
                          Get an API Key
                          <svg
                            className="ml-2 w-5 h-5"
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
                    className={`relative w-full ${
                      index === 2 ? "col-span-1" : ""
                    }`}
                  >
                    {index === 0 ? (
                      <ApiKey onApiKeySubmit={handleApiKeySubmit} />
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
