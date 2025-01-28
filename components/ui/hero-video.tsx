"use client"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export const HeroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented:", error)
        setIsPlaying(false)
      })
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-16 w-full max-w-4xl mx-auto rounded-xl overflow-hidden relative group"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full rounded-xl"
        style={{ willChange: "transform" }}
        controlsList="nodownload"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  )
}
