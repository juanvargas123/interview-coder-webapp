"use client"
import { LinkedinBadge } from "@/components/ui/linked-in-badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/sections/Navbar"
import Image from "next/image"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { HeroVideo } from "@/components/ui/hero-video"
import { StepsSection } from "@/components/sections/StepsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <div className="relative w-full hero-gradient">
      {/* Navigation */}

      {/* <BackgroundBeamsWithCollision className="min-h-screen"> */}
      <Navbar />
      {/* Hero Section */}
      <main className="relative overflow-hidden  flex flex-col items-center justify-center md:pt-36">
        <div className="container px-4 text-center max-w-2xl mx-auto lg:max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LinkedinBadge />
          </motion.div>

          {/* Main Content */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-center text-[24px] font-medium text-[#B3B3B3] font-['Inter']"
            style={{
              fontFamily: '"Inter", "Inter Placeholder", sans-serif',
              fontWeight: 500
            }}
          >
            Meet Interview Coder
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[3.5rem] mb-10  text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            <span className="white-gradient">Invisible AI for </span>{" "}
            <span className="infernal-gradient">Technical</span>{" "}
            <span className="white-gradient">Interviews</span>
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 md:gap-12 w-full justify-center items-center md:text-medium text-sm"
          >
            <Button className="bg-[#8B0000] w-full md:w-auto max-w-[280px]">
              <Image
                src="/apple.svg"
                alt="Apple"
                width={16}
                height={16}
                className="w-5 h-5"
              />
              Download (Intel Mac)
            </Button>
            <Button
              variant="highlight"
              className="w-full md:w-auto max-w-[280px]"
            >
              <Image
                src="/apple_red.svg"
                alt="Apple"
                width={16}
                height={16}
                className="w-5 h-5"
              />
              Download (Apple Silicon)
            </Button>
          </motion.div>

          <HeroVideo />
        </div>
      </main>
      {/* Steps Section */}
      <StepsSection />
      {/* FAQ Section */}
      <FaqSection />
      <Footer />
      {/* </BackgroundBeamsWithCollision> */}
    </div>
  )
}
