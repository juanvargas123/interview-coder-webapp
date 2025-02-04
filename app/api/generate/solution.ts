import axios from "axios"
import { withTimeout, type ProblemInfo } from "../config"
import { z } from "zod"

const SolutionResponse = z.object({
  solution: z.string()
})

export async function generateSolution(
  problemInfo: ProblemInfo,
  openaiApiKey?: string
): Promise<string> {
  if (!openaiApiKey) {
    throw new Error("OpenAI API key is required")
  }

  console.log("Starting OpenAI solution generation...")

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
            content: `Generate a valid ${
              problemInfo.language ?? "python"
            } solution and return it as a JSON object with a 'solution' field containing the code as a string. The solution should be optimal, legible, and include in-line comments after every single line of code. You should try to optimize for legibility and minimize the use of external libraries. Try to format the solution as if you were solving a Leetcode question. Don't include any exmaples of how to use the function or anything, you should only provide the solution.`
          },
          {
            role: "user",
            content: `Please provide the solution in JSON format for the following problem:

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

  const parsedResponse = SolutionResponse.parse(
    JSON.parse(response.data.choices[0].message.content)
  )
  return parsedResponse.solution
}
