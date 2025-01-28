"use client"
import { LinkedinBadge } from "@/components/ui/linked-in-badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/sections/Navbar"
import Image from "next/image"
// import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { HeroVideo } from "@/components/ui/hero-video"
import { StepsSection } from "@/components/sections/StepsSection"
import { CommandsSection } from "@/components/sections/CommandsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { Footer } from "@/components/sections/Footer"
import Link from "next/link"
import { useEffect, useState } from "react"
import { PricingSection } from "@/components/sections/PricingSection"
import { HeroSection } from "@/components/sections/HeroSection"

export default function Home() {
  const [isSilicon, setIsSilicon] = useState(false)

  useEffect(() => {
    const platform = navigator.platform.toLowerCase()
    setIsSilicon(platform.includes("mac") && !platform.includes("intel"))
  }, [])

  const downloadUrl = isSilicon
    ? "https://github.com/ibttf/interview-coder/releases/download/v1.0.7/Interview-Coder-arm64.dmg"
    : "https://github.com/ibttf/interview-coder/releases/download/v1.0.7/Interview-Coder-x64.dmg"

  return (
    <div className="relative w-full hero-gradient lg:px-0 px-4">
      <Navbar />
      <HeroSection />

      <div id="subscription">
        <PricingSection />
      </div>
      <div id="how-to-use">
        <StepsSection />
      </div>
      <CommandsSection />

      <div id="faq">
        <FaqSection />
      </div>
      <Footer />
    </div>
  )
}
