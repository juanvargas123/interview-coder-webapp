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

      const analysisPrompt = `Analyze this Python code and provide a JSON with:
{
  "thoughts": [3 key observations about the implementation, as if you're explaining to a teacher, demonstrating your understanding of the solution],
  "time_complexity": "runtime analysis",
  "space_complexity": "memory usage analysis"
}

Code:
${pythonSolution}`

      console.log("Analysis prompt length:", analysisPrompt.length)
      console.log("Making API request for analysis...")

      const payload = {
        model: "o1-mini",
        messages: [
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        max_completion_tokens: 25000 // Reserve space for reasoning
      }

      console.log("Request payload:", {
        model: payload.model,

        max_completion_tokens: payload.max_completion_tokens,
        content_length: payload.messages[0].content.length
      })

      const analysisResponse = await withTimeout(
        axios.post("https://api.openai.com/v1/chat/completions", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        })
      )

      console.log(
        "Received analysis response with status:",
        analysisResponse.status
      )
      console.log("Response data structure:", {
        has_choices: !!analysisResponse.data?.choices,
        num_choices: analysisResponse.data?.choices?.length,
        has_message: !!analysisResponse.data?.choices?.[0]?.message,
        content_length:
          analysisResponse.data?.choices?.[0]?.message?.content?.length
      })

      if (!analysisResponse.data?.choices?.[0]?.message?.content) {
        console.error(
          "Invalid analysis response structure:",
          analysisResponse.data
        )
        throw new Error("Invalid response from OpenAI API during analysis")
      }

      const analysisContent = analysisResponse.data.choices[0].message.content
      console.log("Raw analysis content:", analysisContent)

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
