import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateResponse(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview"
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenAI:", error)
    throw error
  }
}

export async function analyzeImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and describe what you see."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}
