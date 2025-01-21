// app/api/debug/route.ts
import axios from "axios"
import { NextResponse } from "next/server"
import { withTimeout } from "../config"
import { extractCodeFromImages } from "./extract"
export const maxDuration = 60
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

    const apiKey = process.env.OPEN_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not found in environment variables" },
        { status: 500 }
      )
    }

    try {
      // First extract code from images
      console.log("Extracting code from images...")
      const extractedCode = await extractCodeFromImages(imageDataList, apiKey)
      console.log("Code extracted successfully")

      // Then analyze the code and generate improvements
      console.log("Starting code analysis...")
      console.log("Extracted code length:", extractedCode?.length ?? 0)

      // Simple, direct prompt following o1 guidelines
      const analysisPrompt = `Instructions:
- Analyze the Python code below
- Return a JSON object with these exact fields:
  - old_code: the original code provided
  - new_code: an optimized or corrected version of the code
  - thoughts: array of 3 technical observations as strings
  - time_complexity: runtime analysis as a string
  - space_complexity: memory usage analysis as a string
- Do not include any markdown formatting
- Keep the same implementation structure

Code:
${extractedCode}

Problem:
${problemInfo.problem_statement ?? "Not available"}`

      console.log("Full analysis prompt:", analysisPrompt)
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
        max_completion_tokens: 25000
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

      // Clean any markdown formatting and parse response
      const analysisContent = analysisResponse.data.choices[0].message.content
        .replace(/^```[\w]*\n/, "")
        .replace(/\n```$/, "")

      try {
        const analysis = JSON.parse(analysisContent)
        console.log("Analysis parsed successfully")

        // Return the exact structure expected by the client
        return NextResponse.json({
          old_code: extractedCode,
          new_code: analysis.new_code || extractedCode,
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
