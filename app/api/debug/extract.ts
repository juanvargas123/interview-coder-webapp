import axios from "axios"
import { withTimeout } from "../config"

export async function extractCodeFromImages(
  imageDataList: string[],
  apiKey: string,
  language: "python" | "javascript" | "golang" | "java" = "python"
) {
  console.log("Starting code extraction from images...")

  if (!imageDataList || !Array.isArray(imageDataList)) {
    throw new Error("Invalid imageDataList: must be an array")
  }

  // Process images for inclusion in prompt
  const imageContents = imageDataList.map((imageData) => ({
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${imageData}`
    }
  }))

  // Construct the extraction prompt
  const extractionPrompt = `Extract all relevant information from the provided images. Important notes:
1. Extract all visible ${language} code, maintaining exact indentation and formatting
2. Combine code from multiple images if present
3. Include all visible comments
4. If there are any visible problem statements or question text, include those as well
5. Do not add any improvements or modifications
6. Do not add any markdown formatting
7. Return only the exact code and text seen in the images`

  try {
    const response = await withTimeout(
      axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: extractionPrompt
                },
                ...imageContents
              ]
            }
          ],
          max_tokens: 4000
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        }
      )
    )

    console.log("Received extraction response")

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error("Invalid response structure:", response.data)
      throw new Error("Invalid response from OpenAI API during extraction")
    }

    // Clean any potential markdown formatting
    const extractedCode = response.data.choices[0].message.content
      .replace(/^```[\w]*\n/, "")
      .replace(/\n```$/, "")

    return extractedCode
  } catch (error: any) {
    console.error("Error in code extraction:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}
