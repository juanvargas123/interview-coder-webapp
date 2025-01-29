// app/api/generate/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { withTimeout, type ProblemInfo } from "../config"
import { generateSolution } from "./solution"
export const maxDuration = 300

export async function POST(request: Request) {
  try {
    console.log("Starting POST request processing...")

    const problemInfo = (await request.json()) as ProblemInfo
    console.log("Received problem info:", {
      hasStatement: !!problemInfo.problem_statement,
      hasInputFormat: !!problemInfo.input_format,
      hasOutputFormat: !!problemInfo.output_format,
      numTestCases: problemInfo.test_cases?.length
    })

    const openaiApiKey = process.env.OPENAI_API_KEY
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!openaiApiKey) {
      console.log("OpenAI API key is not configured")
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }
    if (!anthropicApiKey) {
      console.log("Anthropic API key is not configured")
      return NextResponse.json(
        { error: "Anthropic API key is not configured" },
        { status: 500 }
      )
    }

    try {
      // Generate the solution using o1-mini
      console.log(`Generating ${problemInfo.language} solution...`)
      const solution = await generateSolution(problemInfo, openaiApiKey)
      console.log("Solution generated successfully")

      // Then analyze the solution using DeepSeek
      console.log("Starting solution analysis...")

      const analysisPrompt = `You must respond with ONLY a valid JSON object, no markdown, no code blocks, no additional text.
The JSON object must have exactly these fields:
{
  "thoughts": [3 short, conversational thoughts about the solution, said as if you were explaining the process of arriving to the solution before you wrote it to a school teacher, demonstrating your thoughts and understanding of the problem. Keep it short and concise and only mention key points, data structures, algorithms, and core concepts used.],
  "time_complexity": "runtime analysis",
  "space_complexity": "memory usage analysis"
}

Code:
${solution}`

      console.log("Analysis prompt length:", analysisPrompt.length)
      console.log("Making API request for analysis...")

      const response = await withTimeout(
        axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-3-sonnet-20240229",
            max_tokens: 4000,
            temperature: 0,
            system:
              "You are a code analyzer that MUST return ONLY valid JSON with no markdown, no code blocks, and no additional text. Your response should be parseable by JSON.parse() directly.",
            messages: [
              {
                role: "user",
                content: analysisPrompt
              }
            ]
          },
          {
            headers: {
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
              "x-api-key": anthropicApiKey
            }
          }
        )
      )

      console.log("Received analysis response")
      console.log("Full API Response:", JSON.stringify(response.data, null, 2))

      if (!response.data?.content || !response.data.content[0]?.text) {
        console.error(
          "Invalid or empty response from Claude API:",
          response.data
        )
        throw new Error("Invalid response from Claude API during analysis")
      }

      const analysisContent = response.data.content[0].text.trim()

      try {
        // Find the first occurrence of a JSON object
        const jsonMatch = analysisContent.match(/\{[\s\S]*?\}/)
        if (!jsonMatch) {
          throw new Error("Could not find JSON object in response")
        }

        const jsonStr = jsonMatch[0]
        const analysis = JSON.parse(jsonStr)
        console.log("Analysis parsed successfully")

        // Combine the solution and analysis
        return NextResponse.json({
          ...analysis,
          code: solution
        })
      } catch (parseError: any) {
        console.error("Error parsing analysis response:", {
          error: parseError.message,
          content: analysisContent
        })
        return NextResponse.json(
          { error: "Failed to parse analysis response as JSON" },
          { status: 500 }
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
            error: error.config?.url?.includes("anthropic")
              ? "Please close this window and re-enter a valid Anthropic API key."
              : "Please close this window and re-enter a valid OpenAI API key."
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
