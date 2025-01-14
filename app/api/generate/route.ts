// app/api/generate/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { withTimeout, type ProblemInfo } from "../config"
import { generateSolution } from "./solution"

// Helper function to clean markdown code blocks from response
function cleanJsonFromMarkdown(content: string): string {
  // Remove markdown code blocks if present
  return content.replace(/^```[\w]*\n/, "").replace(/\n```$/, "")
}

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

    const apiKey = process.env.OPEN_AI_API_KEY
    if (!apiKey) {
      console.error("OpenAI API key not found")
      return NextResponse.json(
        { error: "OpenAI API key not found in environment variables" },
        { status: 500 }
      )
    }

    try {
      // First generate the Python solution
      console.log("Generating Python solution...")
      const pythonSolution = await generateSolution(problemInfo, apiKey)
      console.log("Solution generated successfully")

      // Then analyze the solution
      console.log("Starting solution analysis...")
      const analysisPrompt = `Given this Python solution for the coding problem:

${pythonSolution}

Analyze this solution and provide:
1. Three key thoughts about the approach taken
2. Time complexity analysis
3. Space complexity analysis

Format the response as a JSON object with these fields:
{
  "thoughts": [
    "First thought showing recognition of the problem and core challenge",
    "Second thought naming specific algorithm/data structure being considered",
    "Third thought showing confidence in approach while acknowledging details needed"
  ],
  "time_complexity": "The time complexity in form O(_) because _",
  "space_complexity": "The space complexity in form O(_) because _"
}

The response must be valid JSON and include only these fields.
Do not wrap the response in markdown code blocks.`

      const analysisResponse = await withTimeout(
        axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4-turbo-preview",
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
              Authorization: `Bearer ${apiKey}`
            }
          }
        )
      )

      console.log("Received analysis response")

      if (!analysisResponse.data?.choices?.[0]?.message?.content) {
        console.error(
          "Invalid analysis response structure:",
          analysisResponse.data
        )
        throw new Error("Invalid response from OpenAI API during analysis")
      }

      const analysisContent = cleanJsonFromMarkdown(
        analysisResponse.data.choices[0].message.content
      )
      console.log("Parsing analysis response:", analysisContent)

      try {
        const analysis = JSON.parse(analysisContent)
        console.log("Analysis parsed successfully")

        // Combine the solution and analysis
        return NextResponse.json({
          ...analysis,
          code: pythonSolution
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
            error:
              "Please close this window and re-enter a valid Open AI API key."
          },
          { status: 401 }
        )
      }
      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            error:
              "API Key out of credits. Please refill your OpenAI API credits and try again."
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
