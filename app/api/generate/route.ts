// app/api/generate/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { withTimeout, type ProblemInfo } from "../config"
import { z } from "zod"

export const maxDuration = 300

const SolutionResponse = z.object({
  thoughts: z.array(z.string()),
  code: z.string(),
  time_complexity: z.string(),
  space_complexity: z.string()
})

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
    if (!openaiApiKey) {
      console.log("OpenAI API key is not configured")
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      )
    }

    try {
      console.log(`Generating ${problemInfo.language} solution and analysis...`)

      const response = await withTimeout(
        axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "o3-mini",
            reasoning_effort: "high",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `You are a coding assistant that generates solutions and analyzes them. You must return a JSON object with exactly these fields:
{
  "thoughts": [3 short, conversational thoughts about your solution approach, as if explaining to a teacher. It's important that you explain your thought process and reasoning for the solution, not just the solution itself, and make sure you talk through it progressively, as if you're arriving at the solution step by step, not as if you're explaining the solution itself. Only talk about the code and the logic, do not mention the fact that every line of code is commented.],
  "code": "The complete ${
    problemInfo.language ?? "python"
  } solution as a string. Make it optimal, legible, and include inline comments after every line. Only write the function, not the test cases or an example of how to use it.",
  "time_complexity": "Must start with big-O notation (e.g., O(n)) followed by a brief explanation of why",
  "space_complexity": "Must start with big-O notation (e.g., O(n)) followed by a brief explanation of why"
}`
              },
              {
                role: "user",
                content: `Generate a solution and analysis for this problem:

Problem Statement: ${problemInfo.problem_statement ?? "None"}
Input Format: ${problemInfo.input_format?.description ?? "None"}
Output Format: ${problemInfo.output_format?.description ?? "None"}
Test Cases: ${JSON.stringify(problemInfo.test_cases ?? [], null, 2)}`
              }
            ]
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`
            }
          }
        )
      )

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI API")
      }

      const result = SolutionResponse.parse(
        JSON.parse(response.data.choices[0].message.content)
      )

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
