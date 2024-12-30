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

interface ApiKeyProps {
  onApiKeySubmit: (apiKey: string) => void
}

const ApiKey: React.FC<ApiKeyProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={contentRef}
      className="w-fit h-fit flex flex-col items-center justify-center bg-gray-50 rounded-xl"
    >
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
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
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
    </div>
  )
}

export default ApiKey
