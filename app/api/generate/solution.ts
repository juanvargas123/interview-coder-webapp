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
${problemInfo.problem_statement ?? "None"}

Input Format:
${problemInfo.input_format?.description ?? "None"}
Parameters:
${
  problemInfo.input_format?.parameters
    ?.map((p) => {
      let typeStr = p.type
      if (p.subtype) typeStr += ` of ${p.subtype}`
      // Add nullable information
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

Generate a Python solution for this problem. The solution should:
1. Be well-commented
2. Include proper type hints for all function parameters and return values
3. Handle all edge cases including None/null values where applicable
4. Pass all test cases
5. Be optimized for time and space complexity
6. Follow Python best practices and PEP 484 type hints

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
