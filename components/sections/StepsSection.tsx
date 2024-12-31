"use client"
import { motion } from "framer-motion"

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
        {steps.map((step, index) => (
          <div key={step.id} className="py-32">
            <div className="max-w-[1400px] mx-auto px-6">
              <div
                className={`ml-[10%] relative ${
                  index === 1 || index === 3
                    ? "bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-black/50 backdrop-blur-xl rounded-xl p-12 border border-white/[0.08] shadow-[0_0_1px_1px_rgba(0,0,0,0.3)] backdrop-saturate-150"
                    : ""
                }`}
              >
                {/* Timelines */}
                {/* First Timeline */}
                {index == 0 && (
                  <div className="absolute -left-[15%] -top-20 bottom-0">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#FF1A1A]/40 to-transparent"
                    />
                    <div className="absolute w-[2px] h-full bg-[#FF1A1A]/20 blur-[4px]" />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute top-[45%] -left-[6px]"
                    >
                      <div className="relative">
                        <div className="absolute h-4 w-4 -left-[1px] -top-[1px] bg-[#FF1A1A]/30 rounded-full blur-[10px]" />
                        <div
                          className="h-3 w-3 bg-[#FF1A1A] rounded-full relative"
                          style={{
                            boxShadow:
                              "0 0 10px #FF1A1A, 0 0 20px rgba(255, 26, 26, 0.5)"
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Second Timeline (inside card) */}
                {index === 1 && (
                  <div className="absolute left-6 top-12 bottom-12">
                    <motion.div
                      initial={{ height: "0%" }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
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
                  <div className="absolute -left-[15%] -top-20 bottom-0">
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
                  <div className="absolute left-6 top-12 bottom-12">
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
                      className={`${
                        index === 1 || index === 3 ? "ml-12" : ""
                      } ${index === 2 || index === 3 ? "max-w-[80%]" : ""}`}
                    >
                      <div
                        className={`text-xl font-medium mb-4 ${
                          index === 1
                            ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text"
                            : index === 2
                            ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-transparent bg-clip-text"
                            : index === 3
                            ? "bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-transparent bg-clip-text"
                            : "bg-gradient-to-r from-[#FF1A1A] to-[#DC2626] text-transparent bg-clip-text"
                        }`}
                      >
                        {step.subtitle}
                      </div>
                      <h2
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 ${
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
                          className="text-white inline-flex items-center hover:opacity-80 transition-all group"
                        >
                          <span className="bg-gradient-to-r from-[#FF1A1A] to-[#DC2626] bg-clip-text text-transparent text-lg">
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
                    className={`relative w-full ${
                      index === 2 ? "col-span-1" : ""
                    } ${
                      index === 1 || index === 3
                        ? "backdrop-blur-sm rounded-lg overflow-hidden"
                        : ""
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
