"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "../input"
import { Button } from "../button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../card"
import { motion, AnimatePresence } from "framer-motion"

const CursorSvg = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 30 30"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute z-50"
  >
    <motion.path d="M 9 3 A 1 1 0 0 0 8 4 L 8 21 A 1 1 0 0 0 9 22 A 1 1 0 0 0 9.796875 21.601562 L 12.919922 18.119141 L 16.382812 26.117188 C 16.701812 26.855187 17.566828 27.188469 18.298828 26.855469 C 19.020828 26.527469 19.340672 25.678078 19.013672 24.955078 L 15.439453 17.039062 L 21 17 A 1 1 0 0 0 22 16 A 1 1 0 0 0 21.628906 15.222656 L 9.7832031 3.3789062 A 1 1 0 0 0 9 3 z" />
  </motion.svg>
)

const ApiKey: React.FC = () => {
  const [apiKey, setApiKey] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    let isAnimating = true

    const animateSequence = async () => {
      while (isAnimating) {
        if (inputRef.current && contentRef.current) {
          const inputRect = inputRef.current.getBoundingClientRect()
          const contentRect = contentRef.current.getBoundingClientRect()

          // Start from outside the component on the left
          setCursorPosition({
            x: -50,
            y: contentRect.height / 2
          })
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Move to input
          setCursorPosition({
            x: inputRect.left - contentRect.left + 10,
            y: inputRect.top - contentRect.top + inputRect.height / 2
          })
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Click effect
          setIsTyping(true)
          await new Promise((resolve) => setTimeout(resolve, 300))

          // Paste API key instantly instead of typing
          setApiKey("sk-" + "x".repeat(20))
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Move to button
          const button = contentRef.current.querySelector(
            'button[type="submit"]'
          )
          if (button) {
            const buttonRect = button.getBoundingClientRect()
            setCursorPosition({
              x: buttonRect.left - contentRect.left + buttonRect.width / 2,
              y: buttonRect.top - contentRect.top + buttonRect.height / 2
            })
          }

          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Trigger shake animation
          setShakeKey((prev) => prev + 1)

          // Move cursor out to the right
          setCursorPosition({
            x: contentRect.width + 50,
            y: contentRect.height / 2
          })

          // Clear everything
          setApiKey("")
          setIsTyping(false)

          // Wait before starting next cycle
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }

    animateSequence()

    return () => {
      isAnimating = false
    }
  }, [])

  return (
    <motion.div
      ref={contentRef}
      key={shakeKey}
      initial={{ rotate: 0 }}
      animate={{
        rotate: [0, -3, 3, -3, 3, -1, 1, 0]
      }}
      transition={{
        duration: 0.5,
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
        ease: "easeInOut"
      }}
      style={{
        transformOrigin: "bottom center"
      }}
      className="w-fit h-fit flex flex-col items-center justify-center bg-gray-50 rounded-xl relative overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ x: cursorPosition.x, y: cursorPosition.y }}
        transition={{ type: "spring", duration: 1 }}
        className="absolute top-0 left-0"
        style={{ pointerEvents: "none" }}
      >
        <CursorSvg />
      </motion.div>

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-center text-black">
            Welcome to Interview Coder
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Please enter your OpenAI API key to continue. Your key will not be
            stored, so keep it in a safe place to copy it for next time. Press
            Cmd + B to hide/show the window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Input
                ref={inputRef}
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
