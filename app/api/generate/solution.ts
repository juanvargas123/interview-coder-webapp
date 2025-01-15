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
    const promptContent = `Given the following coding problem:

Problem Statement:
${problemInfo.problem_statement ?? "Problem statement not available"}

Input Format:
${problemInfo.input_format?.description ?? "Input format not available"}
Parameters:
${
  problemInfo.input_format?.parameters
    ?.map((p) => `- ${p.name}: ${p.type}${p.subtype ? ` of ${p.subtype}` : ""}`)
    .join("\n") ?? "No parameters available"
}

Output Format:
${problemInfo.output_format?.description ?? "Output format not available"}
Returns: ${problemInfo.output_format?.type ?? "Type not specified"}${
      problemInfo.output_format?.subtype
        ? ` of ${problemInfo.output_format.subtype}`
        : ""
    }

Constraints:
${
  problemInfo.constraints
    ?.map((c) => {
      let constraintStr = `- ${c.description}`
      if (c.range) {
        constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
      }
      return constraintStr
    })
    .join("\n") ?? "No constraints specified"
}

Test Cases:
${JSON.stringify(problemInfo.test_cases ?? "No test cases available", null, 2)}

Generate a Python solution for this problem. The solution should:
1. Be well-commented
2. Handle all edge cases
3. Pass all test cases
4. Be optimized for time and space complexity
5. Follow Python best practices

Return only the Python code, no explanations or analysis.
Do not wrap the code in markdown code blocks.`

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
