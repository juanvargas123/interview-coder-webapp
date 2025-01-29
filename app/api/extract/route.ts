// app/api/extract/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { withTimeout } from "../config"
export const maxDuration = 300

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
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageData}`
      }
    }))

    // Construct the messages to send to the model
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Extract the following information from this coding problem image:\n" +
              "1. ENTIRE Problem statement (what needs to be solved)\n" +
              "2. Input/Output format\n" +
              "3. Constraints on the input\n" +
              "4. Example test cases\n" +
              "Format each test case exactly like this:\n" +
              "{'input': {'args': [nums, target]}, 'output': {'result': [0,1]}}\n" +
              "Note: test cases must have 'input.args' as an array of arguments in order,\n" +
              "'output.result' containing the expected return value.\n" +
              "Example for two_sum([2,7,11,15], 9) returning [0,1]:\n" +
              "{'input': {'args': [[2,7,11,15], 9]}, 'output': {'result': [0,1]}}\n"
          },
          ...imageContents
        ]
      }
    ]

    // Define the function schema (same as before)
    const functions = [
      {
        name: "extract_problem_details",
        description:
          "Extract and structure the key components of a coding problem",
        parameters: {
          type: "object",
          properties: {
            problem_statement: {
              type: "string",
              description:
                "The ENTIRE main problem statement describing what needs to be solved"
            },
            input_format: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "Description of the input format"
                },
                parameters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Name of the parameter"
                      },
                      type: {
                        type: "string",
                        enum: [
                          "number",
                          "string",
                          "array",
                          "array2d",
                          "array3d",
                          "matrix",
                          "tree",
                          "graph"
                        ],
                        description: "Type of the parameter"
                      },
                      subtype: {
                        type: "string",
                        enum: ["integer", "float", "string", "char", "boolean"],
                        description:
                          "For arrays, specifies the type of elements"
                      }
                    },
                    required: ["name", "type"]
                  }
                }
              },
              required: ["description", "parameters"]
            },
            output_format: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "Description of the expected output format"
                },
                type: {
                  type: "string",
                  enum: [
                    "number",
                    "string",
                    "array",
                    "array2d",
                    "array3d",
                    "matrix",
                    "boolean"
                  ],
                  description: "Type of the output"
                },
                subtype: {
                  type: "string",
                  enum: ["integer", "float", "string", "char", "boolean"],
                  description: "For arrays, specifies the type of elements"
                }
              },
              required: ["description", "type"]
            },
            constraints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    description: "Description of the constraint"
                  },
                  parameter: {
                    type: "string",
                    description: "The parameter this constraint applies to"
                  },
                  range: {
                    type: "object",
                    properties: {
                      min: { type: "number" },
                      max: { type: "number" }
                    }
                  }
                },
                required: ["description"]
              }
            },
            test_cases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  input: {
                    type: "object",
                    properties: {
                      args: {
                        type: "array",
                        items: {
                          anyOf: [
                            { type: "integer" },
                            { type: "string" },
                            {
                              type: "array",
                              items: {
                                anyOf: [
                                  { type: "integer" },
                                  { type: "string" },
                                  { type: "boolean" },
                                  { type: "null" }
                                ]
                              }
                            },
                            { type: "object" },
                            { type: "boolean" },
                            { type: "null" }
                          ]
                        }
                      }
                    },
                    required: ["args"]
                  },
                  output: {
                    type: "object",
                    properties: {
                      result: {
                        anyOf: [
                          { type: "integer" },
                          { type: "string" },
                          {
                            type: "array",
                            items: {
                              anyOf: [
                                { type: "integer" },
                                { type: "string" },
                                { type: "boolean" },
                                { type: "null" }
                              ]
                            }
                          },
                          { type: "object" },
                          { type: "boolean" },
                          { type: "null" }
                        ]
                      }
                    },
                    required: ["result"]
                  }
                },
                required: ["input", "output"]
              },
              minItems: 1
            }
          },
          required: ["problem_statement"]
        }
      }
    ]

    // Prepare the request payload
    const payload = {
      model: "gpt-4o-mini",
      messages: messages,
      functions: functions,
      function_call: { name: "extract_problem_details" },
      max_tokens: 4096
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
