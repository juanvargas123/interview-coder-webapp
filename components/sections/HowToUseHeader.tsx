"use client"
import React from "react"
import { motion } from "framer-motion"

export function HowToUseHeader() {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="mt-32 text-center !important mb-10 sm:text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto "
      >
        How to Use Interview Coder
      </motion.h2>
    </div>
  )
}
