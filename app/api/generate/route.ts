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
    const openaiApiKey = process.env.OPEN_AI_API_KEY
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY

    // Debug logging
    console.log("Environment check:", {
      hasOpenAI: !!process.env.OPEN_AI_API_KEY,
      hasDeepseek: !!process.env.DEEPSEEK_API_KEY,
      envKeys: Object.keys(process.env).filter(
        (key) => key.includes("API") || key.includes("KEY")
      )
    })

    if (!openaiApiKey || !deepseekApiKey) {
      console.error("OpenAI API key not found")
      return NextResponse.json(
        { error: "OpenAI API key not found in environment variables" },
        { status: 500 }
      )
    }

    try {
      // First generate the Python solution
      console.log("Generating Python solution...")
      const pythonSolution = await generateSolution(
        problemInfo,
        deepseekApiKey,
        openaiApiKey
      )
      console.log("Solution generated successfully")

      // Then analyze the solution
      console.log("Starting solution analysis...")

      const analysisPrompt = `Return a JSON object analyzing this Python code with these fields:
{
  "thoughts": [3 conversational thoughts about the solution, said as if you were explaining the process of arriving to the solution before you wrote it to a school teacher, demonstrating your thoughts and understanding of the problem],
  "time_complexity": "runtime analysis",
  "space_complexity": "memory usage analysis"
}

Code:
${pythonSolution}`

      console.log("Analysis prompt length:", analysisPrompt.length)
      console.log("Making API request for analysis...")

      const response = await withTimeout(
        axios.post(
          "https://api.deepseek.com/chat/completions",
          {
            model: "deepseek-chat",
            messages: [
              {
                content:
                  "You are a Python code analyzer that returns analysis in JSON format.",
                role: "system"
              },
              {
                role: "user",
                content: analysisPrompt
              }
            ],

            stream: false
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${deepseekApiKey}`
            }
          }
        )
      )

      console.log("Received analysis response with status:", response.status)
      console.log("Response data structure:", {
        has_choices: !!response.data?.choices,
        has_content: !!response.data?.choices?.[0]?.message?.content
      })

      if (!response.data?.choices?.[0]?.message?.content) {
        console.error("Invalid analysis response structure:", response.data)
        throw new Error("Invalid response from DeepSeek API during analysis")
      }

      // Get both reasoning and content
      const reasoningContent =
        response.data.choices[0].message.reasoning_content
      console.log("Reasoning content:", reasoningContent)

      const analysisContent = response.data.choices[0].message.content
        .replace(/^```(?:json)?\n/, "") // Remove opening markdown
        .replace(/\n```$/, "") // Remove closing markdown
        .trim()

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
