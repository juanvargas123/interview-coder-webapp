"use client"
import React from "react"
import { motion } from "framer-motion"

export function HowToUseHeader() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="mt-32 text-[3.5rem] text-center mb-10 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto"
      >
        How to Use Interview Coder
      </motion.h1>
    </div>
  )
}
