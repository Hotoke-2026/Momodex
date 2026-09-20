import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

interface Species {
  id: string
  name: string
}

export async function identifySpecies(
  imageUrl: string,
  shortlist: Species[],
  retries = 3,
  delayMs = 2000
): Promise<string> {
  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()
  const base64Image = Buffer.from(imageBuffer).toString('base64')

  const speciesNames = shortlist.map((s) => s.name)

  const promptText = `
You are identifying a New Zealand species from a photo.
Only choose from this list of species: ${speciesNames.join(', ')}.
Respond with ONLY the species name, exactly as written in the list above — no extra words.
If none of them match, respond with exactly: NO_MATCH
`

  const contents = [
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    { text: promptText },
  ]

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      })
      return response.text?.trim() ?? 'NO_MATCH'
    } catch (error: any) {
      if (error?.status === 503 && attempt < retries) {
        console.warn(`Gemini 503 high demand encountered. Retrying attempt ${attempt + 1} in ${delayMs}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }
      throw error
    }
  }

  return 'NO_MATCH'
}