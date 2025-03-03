"use client"
import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function HowToUseHeader() {
  const { t } = useLanguage()
  
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
        className="mt-32  mb-10 text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto text-center"
      >
        {t('steps.howToUse')}
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="text-center text-lg leading-8 text-[#999999]"
      >
        {t('steps.howToUseSubtitle')}{" "}
        <Link
          href="/help"
          className="underline hover:text-gray-700  transition-colors"
        >
          help center
        </Link>
      </motion.h3>
    </div>
  )
}
