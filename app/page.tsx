"use client"
import Navbar from "@/components/sections/Navbar"
// import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams"
import { CommandsSection } from "@/components/sections/CommandsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { Footer } from "@/components/sections/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { PricingSection } from "@/components/sections/PricingSection"
import { StepsSection } from "@/components/sections/StepsSection"

export default function Home() {
  return (
    <div className="relative w-screen overflow-x-hidden hero-gradient lg:px-0 px-4">
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
