"use client"
import { useState, useEffect } from "react"
import { Input } from "../input"
import { Button } from "../button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../card"
import { motion } from "framer-motion"

const ApiKey: React.FC = () => {
  const [apiKey, setApiKey] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    let isAnimating = true

    const animateSequence = async () => {
      while (isAnimating) {
        // Start typing animation
        setIsTyping(true)
        await new Promise((resolve) => setTimeout(resolve, 450))

        // Type the API key
        setApiKey("sk-" + "x".repeat(40))
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Trigger shake
        setShakeKey((prev) => prev + 1)
        await new Promise((resolve) => setTimeout(resolve, 750))

        // Reset
        setApiKey("")
        setIsTyping(false)
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }

    animateSequence()

    return () => {
      isAnimating = false
    }
  }, [])

  return (
    <motion.div
      key={shakeKey}
      initial={{ rotate: 0 }}
      animate={{
        rotate: [0, -3, 3, -3, 3, -1, 1, 0]
      }}
      transition={{
        duration: 0.75,
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
        ease: "easeInOut"
      }}
      style={{
        transformOrigin: "bottom center"
      }}
      className="w-fit h-fit flex flex-col items-center justify-center bg-gray-50 rounded-xl relative"
    >
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-center text-black">
            Welcome to Interview Coder
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Please enter your OpenAI API key to continue. Your key will not be
            stored, so keep it in a safe place to copy it for next time. Press ⌘
            + B to hide/show the window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`w-full placeholder:text-black/50 text-black border-none ${
                  isTyping ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>

            <Button
              type="submit"
              onClick={(e: any) => {
                e.preventDefault()
                setShakeKey((prev) => prev + 1)
              }}
              className="w-full font-medium text-gray-800 border shadow-md"
              variant="ghost"
              disabled={!apiKey.trim()}
            >
              Continue
            </Button>
            <p className="text-gray-400 text-xs text-center pt-2">
              built out of frustration by{" "}
              <button
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/roy-lee-cs123",
                    "_blank"
                  )
                }
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Roy
              </button>{" "}
              n'{" "}
              <button
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/neel-shanmugam/",
                    "_blank"
                  )
                }
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Neel
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ApiKey
