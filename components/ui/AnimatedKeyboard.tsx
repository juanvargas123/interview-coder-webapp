import styles from "@/styles/Keyboard.module.css"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const KeyboardKey = ({
  children,
  isGlowing = false,
  isSpace = false,
  isModifier = false,
  delay = 0
}) => {
  const glowVariants = {
    initial: {
      boxShadow: "none",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      background: "rgba(20, 20, 20, 0.95)"
    },
    animate: {
      boxShadow:
        "0 0 1.875rem rgba(255, 238, 0, 0.4), 0 0 3.75rem rgba(255, 238, 0, 0.2), 0 0 5.625rem rgba(255, 238, 0, 0.1)",
      border: "0.0625rem solid rgba(255, 238, 0, 0.6)",
      background: "rgba(255, 238, 0, 0.08)",
      transition: {
        duration: 0.3,
        delay: delay
      }
    }
  }

  return (
    <motion.div
      className={`${styles.key} ${isGlowing ? styles.glowing : ""} ${
        isSpace ? styles.spaceKey : ""
      } ${isModifier ? styles.modifierKey : ""}`}
      variants={isGlowing ? glowVariants : undefined}
      initial={isGlowing ? "initial" : undefined}
      animate={isGlowing ? "animate" : undefined}
    >
      <motion.div
        className={styles.alignCenter}
        animate={
          isGlowing
            ? {
                color: "rgba(255, 238, 0, 1)",
                textShadow:
                  "0 0 15px rgba(255, 238, 0, 0.9), 0 0 30px rgba(255, 238, 0, 0.6)"
              }
            : undefined
        }
        initial={
          isGlowing
            ? {
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "none"
              }
            : undefined
        }
        transition={
          isGlowing
            ? {
                duration: 0.3,
                delay: delay
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const KeyboardRow = ({ children, isBottom = false }) => (
  <div className={`${styles.keyboardRow} ${isBottom ? styles.bottomRow : ""}`}>
    {children}
  </div>
)

export const AnimatedKeyboard = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Return null on server-side and first render
  }

  return (
    <div className={styles.container}>
      <div className={styles.keyboard}>
        <div className={styles.keyboardContainer}>
          <KeyboardRow>
            <KeyboardKey>
              <span className={styles.primary}>esc</span>
            </KeyboardKey>
            {[...Array(12)].map((_, i) => (
              <KeyboardKey key={i}>
                <span className={styles.primary}>F{i + 1}</span>
              </KeyboardKey>
            ))}
          </KeyboardRow>

          <KeyboardRow>
            <KeyboardKey>
              <span className={styles.alt}>`</span>
              <span className={styles.primary}>~</span>
            </KeyboardKey>
            {[
              { alt: "!", primary: "1" },
              { alt: "@", primary: "2" },
              { alt: "#", primary: "3" },
              { alt: "$", primary: "4" },
              { alt: "%", primary: "5" },
              { alt: "^", primary: "6" },
              { alt: "&", primary: "7" },
              { alt: "*", primary: "8" },
              { alt: "(", primary: "9" },
              { alt: ")", primary: "0" },
              { alt: "_", primary: "-" },
              { alt: "+", primary: "=" }
            ].map((key) => (
              <KeyboardKey key={key.primary}>
                <span className={styles.alt}>{key.alt}</span>
                <span className={styles.primary}>{key.primary}</span>
              </KeyboardKey>
            ))}
          </KeyboardRow>

          <KeyboardRow>
            {[
              "Q",
              "W",
              "E",
              "R",
              "T",
              "Y",
              "U",
              "I",
              "O",
              "P",
              "[",
              "]",
              "\\"
            ].map((key) => (
              <KeyboardKey key={key}>
                <span className={styles.primary}>{key}</span>
              </KeyboardKey>
            ))}
          </KeyboardRow>

          <KeyboardRow>
            {["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"].map(
              (key) => (
                <KeyboardKey key={key}>
                  <span className={styles.primary}>{key}</span>
                </KeyboardKey>
              )
            )}
          </KeyboardRow>

          <KeyboardRow>
            {["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"].map((key) => (
              <KeyboardKey key={key} isGlowing={key === "B"} delay={0.5}>
                <span className={styles.primary}>{key}</span>
              </KeyboardKey>
            ))}
          </KeyboardRow>

          <KeyboardRow isBottom>
            <KeyboardKey isModifier>
              <div className={styles.commandKey}>
                <span>control</span>
                <span className={styles.icon}>^</span>
              </div>
            </KeyboardKey>
            <KeyboardKey isModifier>
              <div className={styles.commandKey}>
                <span>option</span>
                <span className={styles.icon}>⌥</span>
              </div>
            </KeyboardKey>
            <KeyboardKey isModifier isGlowing delay={0.5}>
              <div className={styles.commandKey}>
                <span>command</span>
                <span className={styles.icon}>⌘</span>
              </div>
            </KeyboardKey>
            <KeyboardKey isSpace>
              <div className={styles.primary}></div>
            </KeyboardKey>
            <KeyboardKey isModifier>
              <div className={styles.commandKey}>
                <span>command</span>
                <span className={styles.icon}>⌘</span>
              </div>
            </KeyboardKey>
            <KeyboardKey isModifier>
              <div className={styles.commandKey}>
                <span>option</span>
                <span className={styles.icon}>⌥</span>
              </div>
            </KeyboardKey>
          </KeyboardRow>
        </div>
      </div>
    </div>
  )
}
