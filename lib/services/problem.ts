import { generateResponse } from "./openai"

export interface ProblemInput {
  code: string
  language: string
  description: string
}

export interface ProcessedResult {
  explanation: string
  suggestions: string[]
  debugSteps: string[]
}

export async function processProblem(
  input: ProblemInput
): Promise<ProcessedResult> {
  const prompt = `
    Analyze the following ${input.language} code:
    
    ${input.code}
    
    Problem description: ${input.description}
    
    Please provide:
    1. A clear explanation of the issue
    2. Specific suggestions for improvement
    3. Step-by-step debugging instructions
    
    Format the response in JSON with the following structure:
    {
      "explanation": "detailed explanation here",
      "suggestions": ["suggestion1", "suggestion2", ...],
      "debugSteps": ["step1", "step2", ...]
    }
  `

  try {
    const response = await generateResponse(prompt)
    if (!response) throw new Error("No response from AI")

    const parsedResponse = JSON.parse(response)
    return {
      explanation: parsedResponse.explanation,
      suggestions: parsedResponse.suggestions,
      debugSteps: parsedResponse.debugSteps
    }
  } catch (error) {
    console.error("Error processing problem:", error)
    throw new Error("Failed to process the problem")
  }
}

export async function extractCodeFromImage(imageUrl: string): Promise<string> {
  const prompt = `
    Extract and format any code visible in this image.
    If multiple code snippets are present, separate them with comments indicating their context.
    Return only the extracted code, no explanations.
  `

  try {
    const response = await generateResponse(prompt)
    return response || ""
  } catch (error) {
    console.error("Error extracting code from image:", error)
    throw new Error("Failed to extract code from image")
  }
}
