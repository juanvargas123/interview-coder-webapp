// app/api/debug/route.ts
import axios from "axios"
import { NextResponse } from "next/server"
import { withTimeout } from "../config"
import { extractCodeFromImages } from "./extract"
export const maxDuration = 300
export async function POST(request: Request) {
  try {
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
    const openaiApiKey = process.env.OPEN_AI_API_KEY
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY

    if (!deepseekApiKey || !openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not found in environment variables." },
        { status: 500 }
      )
    }

    try {
      // First extract code from images
      console.log("Extracting code from images...")
      const extractedCode = await extractCodeFromImages(
        imageDataList,
        openaiApiKey
      )
      console.log("Code extracted successfully")

      // Then analyze the code and generate improvements
      console.log("Starting code analysis...")
      console.log("Extracted code length:", extractedCode?.length ?? 0)

      // Simple, direct prompt following o1 guidelines
      const analysisPrompt = `Return a JSON object analyzing this Python code with these fields:
{
  "new_code": "an optimized or corrected version of the code, with comments explaining the changes",
  "thoughts": [3 conversational thoughts about what you changed, explaining your debugging process and analysis as if walking through your thought process with another developer],
  "time_complexity": "runtime analysis",
  "space_complexity": "memory usage analysis"
}

Code and Problem Information:
${extractedCode}

Additional Problem Context:
${problemInfo.problem_statement ?? "Not available"}`

      console.log("Full analysis prompt:", analysisPrompt)
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
                  "You are a Python code analyzer that returns analysis in JSON format, with no markdown or code blocks. You should be very specific and detailed in your analysis, and you should be very specific in your thoughts. " +
                  analysisPrompt,
                role: "user"
              }
            ]
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

      const rawContent = response.data.choices[0].message.content
      console.log("Raw content from API:", rawContent)

      const analysisContent = rawContent
        .replace(/^```(?:json)?\n?/g, "") // Remove any opening code block
        .replace(/\n?```\s*$/g, "") // Remove any closing code block at the end
        .replace(/^```.*$/gm, "") // Remove any other code block markers
        .trim() // Remove any extra whitespace

      console.log("Cleaned content:", analysisContent)
      console.log("Content length before parsing:", analysisContent.length)
      console.log(
        "Last 10 characters:",
        JSON.stringify(analysisContent.slice(-10))
      )

      try {
        const analysis = JSON.parse(analysisContent)
        console.log("Analysis parsed successfully")

        // Return the exact structure expected by the client
        return NextResponse.json({
          new_code: analysis.new_code,
          thoughts: analysis.thoughts,
          time_complexity: analysis.time_complexity,
          space_complexity: analysis.space_complexity
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
            error: "There was an error with your request. Please try again."
          },
          { status: 401 }
        )
      }
      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            error:
              "API Key out of credits. Please let us know at https://www.interviewcoder.co/contact."
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
