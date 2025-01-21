import axios from "axios"
import { withTimeout, type ProblemInfo } from "../config"

// Helper function to clean markdown code blocks from response
function cleanCodeFromMarkdown(content: string): string {
  // Remove markdown code blocks if present
  return content.replace(/^```[\w]*\n/, "").replace(/\n```$/, "")
}

export async function generateSolution(
  problemInfo: ProblemInfo,
  apiKey: string
) {
  console.log("Starting solution generation...")

  try {
    // Build the prompt for solution generation
    const promptContent = `You are a Python code generator. Your task is to generate a valid Python solution for the following problem.
IMPORTANT: Return ONLY the Python code solution. No explanations, no markdown formatting, no additional text.

PROBLEM DETAILS:
---------------
Problem Statement:
${problemInfo.problem_statement ?? "None"}

Input Format:
${problemInfo.input_format?.description ?? "None"}

Parameters:
${
  problemInfo.input_format?.parameters
    ?.map((p) => {
      let typeStr = p.type
      if (p.subtype) typeStr += ` of ${p.subtype}`
      typeStr += p.nullable ? " | None" : " (required)"
      return `- ${p.name}: ${typeStr}`
    })
    .join("\n") ?? "No parameters"
}

Output Format:
${problemInfo.output_format?.description ?? "None"}
Returns: ${problemInfo.output_format?.type ?? "None"}${
      problemInfo.output_format?.subtype
        ? ` of ${problemInfo.output_format.subtype}`
        : ""
    }${problemInfo.output_format?.nullable ? " | None" : " (never None)"}

Constraints:
${
  problemInfo.constraints
    ?.map((c) => {
      let constraintStr = `- ${c.description}`
      if (c.range) {
        constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
      }
      if (c.nullable !== undefined) {
        constraintStr += c.nullable ? " (can be None)" : " (cannot be None)"
      }
      return constraintStr
    })
    .join("\n") ?? "No constraints"
}

Test Cases:
${JSON.stringify(problemInfo.test_cases ?? [], null, 2)}

REQUIREMENTS:
------------
1. Use proper Python type hints (PEP 484)
2. Handle all edge cases and None/null values
3. Include clear but concise comments
4. Optimize for time and space complexity
5. Pass all test cases

RESPONSE FORMAT:
--------------
Return only valid Python code without any markdown formatting or additional text.
Start directly with the function definition.`

    console.log("Making API request to OpenAI for solution generation...")

    const response = await withTimeout(
      axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "o1-mini",
          messages: [
            {
              role: "user",
              content: promptContent
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

    console.log("Received response from OpenAI")

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error("Invalid response structure:", response.data)
      throw new Error("Invalid response from OpenAI API")
    }

    const content = response.data.choices[0].message.content
    return cleanCodeFromMarkdown(content)
  } catch (error: any) {
    console.error("Error in generateSolution:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error // Re-throw to be handled by the route handler
  }
}
