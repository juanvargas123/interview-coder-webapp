"use client"
import { LinkedinBadge } from "@/components/ui/linked-in-badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/sections/Navbar"
import Image from "next/image"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <div className="relative w-full">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="relative overflow-hidden h-[80vh] flex flex-col items-center justify-center -mt-16">
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
              className="text-gray-400/80 text-2xl md:text-3xl lg:text-4xl mb-6 font-semibold"
            >
              Meet Interview Coder
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[3.5rem] mb-10 sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto"
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
              className="flex flex-col md:flex-row gap-4 md:gap-12 w-full justify-center items-center"
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
          </div>
        </main>
      </div>
    </BackgroundBeamsWithCollision>
  )
}
