import OpenAI from "openai"
import { withTimeout } from "../config"

export async function extractCodeFromImages(
  imageDataList: string[],
  apiKey: string,
  language:
    | "python"
    | "javascript"
    | "golang"
    | "ruby"
    | "java"
    | "cpp"
    | "kotlin"
    | "swift" = "python"
) {
  console.log("Starting code extraction from images...")

  if (!imageDataList || !Array.isArray(imageDataList)) {
    throw new Error("Invalid imageDataList: must be an array")
  }

  // Process images for inclusion in prompt
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
        messages: [
          {
            role: "system",
            content: `Extract all relevant information from the provided images. Important notes:
1. Extract all visible ${language} code, maintaining exact indentation and formatting
2. Combine code from multiple images if present 
3. Include all visible comments
4. If there are any visible problem statements or question text, include those as well
5. Do not add any improvements or modifications
6. Do not add any markdown formatting
7. Return only the exact code and text seen in the images`
          },
          {
            role: "user",
            content: [
              {
                type: "text" as const,
                text: "Extract the code and any relevant text from these images."
              },
              ...imageContents
            ]
          }
        ]
      })
    )

    console.log("Received extraction response")

    if (!completion.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API")
    }

    // Clean any potential markdown formatting
    const extractedCode = completion.choices[0].message.content
      .replace(/^```[\w]*\n/, "")
      .replace(/\n```$/, "")

    return extractedCode
  } catch (error: any) {
    console.error("Error in code extraction:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    if (error.response?.status === 401) {
      throw new Error("Please provide a valid OpenAI API key")
    }
    if (error.response?.status === 429) {
      throw new Error(
        "API Key out of credits. Please refill your OpenAI API credits and try again."
      )
    }
    throw error
  }
}
