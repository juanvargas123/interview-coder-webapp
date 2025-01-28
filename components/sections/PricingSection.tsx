"use client"

import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { BadgeCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../ui/button"

const GlowingLine = () => (
  <div className="relative w-full max-w-[400px] mx-auto h-[80px] mb-16">
    {/* Left line container */}
    <div className="absolute left-0 top-[25px] w-[40%] sm:w-[160px] overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-[2px] bg-gradient-to-l to-transparent from-[#FFFF00] to-90%"
      />
    </div>

    {/* Right line container */}
    <div className="absolute right-0 top-[25px] w-[40%] sm:w-[160px] overflow-hidden">
      <motion.div
        initial={{ x: "100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-[2px] bg-gradient-to-r to-transparent from-[#FFFF00] to-90%"
      />
    </div>

    {/* Extra glow layer for center */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[25px] w-[40px] h-[2px] bg-[#FFFF00] blur-[4px]" />

    {/* PRO text with glow */}
    <div className="absolute left-1/2 -translate-x-1/2 top-0">
      <div className="relative">
        <div className="absolute -inset-1 bg-[#FFFF00]/30 blur-[10px]" />
        <div
          className="relative text-lg sm:text-xl tracking-[0.2em] font-light text-[#FFFF00]"
          style={{
            textShadow: "0 0 10px #FFFF00, 0 0 20px rgba(255, 255, 0, 0.5)"
          }}
        >
          PRO
        </div>
      </div>
    </div>
  </div>
)

export const PricingSection = () => {
  const router = useRouter()

  const handleSubscribeClick = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/signin")
      return
    }
  }

  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-48">
        <GlowingLine />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Interview Coder just got a lot smarter.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#999999]">
            Better prompts. 4o-mini to o1. We smurf on hards now. <br />
            <br />
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <div className="mt-10 flex justify-center">
            <Button
              variant="highlight"
              className="w-full max-w-md h-12"
              onClick={handleSubscribeClick}
            >
              <div className="flex gap-2 items-center justify-center w-full text-base">
                <BadgeCheck className="w-5 h-5" />
                Subscribe today ($20/month)
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
