// app/api/debug/route.ts
import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { withTimeout } from "../config"
import { extractCodeFromImages } from "./extract"
import { z } from "zod"

export const maxDuration = 60

const DebugResponse = z.object({
  new_code: z.string(),
  thoughts: z.array(z.string()),
  time_complexity: z.string(),
  space_complexity: z.string()
})

export async function POST(request: Request) {
  try {
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

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured" },
        { status: 500 }
      )
    }

    try {
      // First extract code from images
      console.log("Extracting code from images...")
      const extractedCode = await extractCodeFromImages(
        imageDataList,
        process.env.ANTHROPIC_API_KEY, // Still using OpenAI for code extraction
        problemInfo.language
      )
      console.log("Code extracted successfully")
      console.log("Starting code analysis...")
      console.log("Extracted code length:", extractedCode?.length ?? 0)

      const anthropic = new Anthropic({
        apiKey: anthropicApiKey
      })

      const systemPrompt = `You are a code analyzer that optimizes and debugs code. 

Your response MUST be a valid JSON object and nothing else. DO NOT include any introduction, explanation, or conclusion outside the JSON structure.

For each field in your response:
- new_code: Provide an optimized or corrected version of the ${problemInfo.language} code, with comments explaining the changes. Do not add any example usages of how to use it or examples of how to use it. You should only return the code and explanatory comments.
- thoughts: Provide 3 short, conversational thoughts about what you changed, explaining your debugging process and analysis as if walking through your thought process with another developer
- time_complexity: Start with big-O notation (e.g., O(n)) followed by a brief explanation of why
- space_complexity: Start with big-O notation (e.g., O(n)) followed by a brief explanation of why

Your response must be EXACTLY in this JSON format and nothing else:
{
  "new_code": "string",
  "thoughts": ["string", "string", "string"],
  "time_complexity": "string",
  "space_complexity": "string"
}`

      const userPrompt = `Analyze, debug, and optimize this code:

${extractedCode}

Additional Problem Context:
${problemInfo.problem_statement ?? "Not available"}`

      const response = await withTimeout(
        anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      )

      // Parse the JSON response from Claude's message content
      if (
        !response.content ||
        !Array.isArray(response.content) ||
        response.content.length === 0
      ) {
        throw new Error("Invalid response format from Anthropic API")
      }

      // Find the text content block
      const textBlock = response.content.find((block) => block.type === "text")
      if (!textBlock || typeof textBlock.text !== "string") {
        throw new Error("No text content in Anthropic API response")
      }

      const responseContent = textBlock.text

      // Attempt to extract JSON from the response by looking for a JSON structure
      let jsonStr = responseContent
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }

      try {
        // Try to parse the extracted JSON
        const result = JSON.parse(jsonStr)

        // Validate the response against our schema
        const parsedResult = DebugResponse.parse(result)

        return NextResponse.json(parsedResult)
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        throw new Error(
          "Failed to parse JSON response from Claude. Received: " +
            responseContent.substring(0, 100) +
            "..."
        )
      }
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
              "Please close this window and re-enter a valid Anthropic API key."
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
