// app/api/debug/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import {
  withTimeout,
  type ProblemInfo,
  type DebugSolutionResponse
} from "../config"

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

    // Process images for inclusion in prompt
    const imageContents = imageDataList.map((imageData) => ({
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageData}`
      }
    }))

    // Build the prompt with error handling
    const problemStatement =
      problemInfo.problem_statement ?? "Problem statement not available"
    const inputFormatDescription =
      problemInfo.input_format?.description ??
      "Input format description not available"
    const inputParameters = problemInfo.input_format?.parameters
      ? problemInfo.input_format.parameters
          .map(
            (p) =>
              `- ${p.name}: ${p.type}${p.subtype ? ` of ${p.subtype}` : ""}`
          )
          .join(" ")
      : "Input parameters not available"

    const outputFormatDescription =
      problemInfo.output_format?.description ??
      "Output format description not available"
    const returns = problemInfo.output_format?.type
      ? `Returns: ${problemInfo.output_format.type}${
          problemInfo.output_format.subtype
            ? ` of ${problemInfo.output_format.subtype}`
            : ""
        }`
      : "Returns: Output type not available"

    const constraints = problemInfo.constraints
      ? problemInfo.constraints
          .map((c) => {
            let constraintStr = `- ${c.description}`
            if (c.range) {
              constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
            }
            return constraintStr
          })
          .join(" ")
      : "Constraints not available"

    let exampleTestCases = "Test cases not available"
    if (problemInfo.test_cases) {
      try {
        exampleTestCases = JSON.stringify(problemInfo.test_cases, null, 2)
      } catch {
        exampleTestCases = "Test cases not available"
      }
    }

    // Construct the debug prompt
    const debugPrompt = `
Given the following coding problem and its visual representation:

Problem Statement:
${problemStatement}

Input Format:
${inputFormatDescription}
Parameters:
${inputParameters}

Output Format:
${outputFormatDescription}
${returns}

Constraints:
${constraints}

Example Test Cases:
${exampleTestCases}

First extract and analyze the code shown in the image. Then create an improved version while maintaining the same general approach and structure. The old code you save should ONLY be the exact code that you see on the screen, regardless of any optimizations or changes you make. Make all your changes in the new_code field. You should use the image that has the most recent, longest version of the code, making sure to combine multiple images if necessary.
Focus on keeping the solution syntactically similar but with optimizations and INLINE comments ONLY ON lines of code that were changed. Make sure there are no extra line breaks and all the code that is unchanged is in the same line as it was in the original code.

IMPORTANT FORMATTING NOTES:
1. Use actual line breaks (press enter for new lines) in both old_code and new_code
2. Maintain proper indentation with spaces in both code blocks
3. Add inline comments ONLY on changed lines in new_code
4. The entire response must be valid JSON that can be parsed`

    // Construct the messages array
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: debugPrompt
          },
          ...imageContents
        ]
      }
    ]

    // Define the function schema
    const functions = [
      {
        name: "provide_solution",
        description:
          "Debug based on the problem and provide a solution to the coding problem",
        parameters: {
          type: "object",
          properties: {
            thoughts: {
              type: "array",
              items: { type: "string" },
              description:
                "Share up to 3 key thoughts as you work through solving this problem for the first time. Write in the voice of someone actively reasoning through their approach, using natural pauses, uncertainty, and casual language that shows real-time problem solving. Each thought must be max 100 characters and be full sentences that don't sound choppy when read aloud.",
              maxItems: 3,
              thoughtGuidelines: [
                "First thought should capture that initial moment of recognition - connecting it to something familiar or identifying the core challenge. Include verbal cues like 'hmm' or 'this reminds me of' that show active thinking.",
                "Second thought must explore your emerging strategy and MUST explicitly name the algorithm or data structure being considered. Show both knowledge and uncertainty - like 'I could probably use a heap here, but I'm worried about...'",
                "Third thought should show satisfaction at having a direction while acknowledging you still need to work out specifics - like 'Okay, I think I see how this could work...'"
              ]
            },
            old_code: {
              type: "string",
              description:
                "The exact code implementation found in the image. There should be no additional lines of code added, this should only contain the code that is visible from the images, regardless of correctness or any fixes you can make. Include every line of code that are visible in the image.  You should use the image that has the most recent, longest version of the code, making sure to combine multiple images if necessary."
            },
            new_code: {
              type: "string",
              description:
                "The improved code implementation with in-line comments only on lines of code that were changed"
            },
            time_complexity: {
              type: "string",
              description:
                "Time complexity with explanation, format as 'O(_) because _.' Importantly, if there were slight optimizations in the complexity that don't affect the overall complexity, MENTION THEM."
            },
            space_complexity: {
              type: "string",
              description:
                "Space complexity with explanation, format as 'O(_) because _' Importantly, if there were slight optimizations in the complexity that don't affect the overall complexity, MENTION THEM."
            }
          },
          required: [
            "thoughts",
            "old_code",
            "new_code",
            "time_complexity",
            "space_complexity"
          ]
        }
      }
    ]

    // Prepare the payload for the API call
    const payload = {
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 4000,
      temperature: 0,
      functions: functions,
      function_call: { name: "provide_solution" }
    }

    try {
      const response = await withTimeout(
        axios.post("https://api.openai.com/v1/chat/completions", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        })
      )

      const functionCallArguments =
        response.data.choices[0].message.function_call.arguments
      return NextResponse.json(JSON.parse(functionCallArguments))
    } catch (error: any) {
      if (error.message?.includes("Operation timed out")) {
        return NextResponse.json(
          { error: "Operation timed out after 1 minute. Please try again." },
          { status: 408 }
        )
      }
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
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    )
  }
}
