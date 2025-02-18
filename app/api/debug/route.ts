// app/api/debug/route.ts
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { withTimeout } from "../config"
import { verifyAuth } from "../auth"
import { extractCodeFromImages } from "./extract"
import { z } from "zod"

export const maxDuration = 300

const DebugResponse = z.object({
  new_code: z.string(),
  thoughts: z.array(z.string()),
  time_complexity: z.string(),
  space_complexity: z.string()
})

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth()
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    console.log("Starting POST request processing...")
    const { imageDataList, problemInfo } = await request.json()

    if (!imageDataList || !Array.isArray(imageDataList)) {
      return NextResponse.json(
        {
          error:
            "Invalid request: imageDataList is required and must be an array"
        },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    try {
      // First extract code from images
      console.log("Extracting code from images...")
      const extractedCode = await extractCodeFromImages(
        imageDataList,
        openaiApiKey,
        problemInfo.language
      )
      console.log("Code extracted successfully")
      console.log("Starting code analysis...")
      console.log("Extracted code length:", extractedCode?.length ?? 0)

      const openai = new OpenAI({ apiKey: openaiApiKey })

      const completion = await withTimeout(
        openai.beta.chat.completions.parse({
          model: "o3-mini",
          reasoning_effort: "high",
          messages: [
            {
              role: "system",
              content: `You are a code analyzer that optimizes and debugs code. For each field in your response:
- new_code: Provide an optimized or corrected version of the ${problemInfo.language} code, with comments explaining the changes. Do not add any example usages of how to use it or examples of how to use it. You should only return the code and explanatory comments.
- thoughts: Provide 3 short, conversational thoughts about what you changed, explaining your debugging process and analysis as if walking through your thought process with another developer
- time_complexity: Start with big-O notation (e.g., O(n)) followed by a brief explanation of why
- space_complexity: Start with big-O notation (e.g., O(n)) followed by a brief explanation of why`
            },
            {
              role: "user",
              content: `Analyze, debug, and optimize this code:

${extractedCode}

Additional Problem Context:
${problemInfo.problem_statement ?? "Not available"}`
            }
          ],
          response_format: zodResponseFormat(DebugResponse, "debug")
        })
      )

      const result = completion.choices[0].message.parsed
      return NextResponse.json(result)
    } catch (error: any) {
      console.error("Error in API request:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            error:
              "Please close this window and re-enter a valid OpenAI API key."
          },
          { status: 401 }
        )
      }
      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            error:
              "API Key rate limit exceeded. Please try again in a few minutes."
          },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: error.message || "An unknown error occurred" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Outer error handler:", {
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    )
  }
}
