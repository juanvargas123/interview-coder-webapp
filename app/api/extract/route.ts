// app/api/extract/route.ts
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { z } from "zod"
import { withTimeout } from "../config"

export const maxDuration = 300

const ExtractResponse = z.object({
  problem_statement: z.string(),
  test_cases: z.array(z.any()).default([])
})

export async function POST(request: Request) {
  try {
    const { imageDataList } = await request.json()

    if (!imageDataList || !Array.isArray(imageDataList)) {
      return NextResponse.json(
        {
          error:
            "Invalid request: imageDataList is required and must be an array"
        },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not found in environment variables" },
        { status: 500 }
      )
    }

    // Prepare the image contents for the message
    const imageContents = imageDataList.map((imageData) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:image/jpeg;base64,${imageData}`
      }
    }))

    const openai = new OpenAI({ apiKey })

    try {
      const completion = await withTimeout(
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are a coding problem extractor that analyzes images of coding problems. You must return a JSON object with exactly these fields:
{
  "problem_statement": "The complete problem description of what needs to be solved",
  "test_cases": [
    {
      "input": { "args": [arg1, arg2, ...] },
      "output": { "result": expectedResult }
    },
    ...more test cases if available...
  ]
}

If no test cases are visible in the image, return an empty array for test_cases. When test cases are present, try to format them with input args and output result, but any reasonable test case format is acceptable.`
            },
            {
              role: "user",
              content: [
                {
                  type: "text" as const,
                  text: "Extract the complete problem statement and any test cases from this image. Format the response exactly as specified."
                },
                ...imageContents
              ]
            }
          ]
        })
      )

      if (!completion.choices[0]?.message?.content) {
        throw new Error("Invalid response from OpenAI API")
      }

      const result = ExtractResponse.parse(
        JSON.parse(completion.choices[0].message.content)
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
