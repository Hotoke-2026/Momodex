import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

interface Species {
  id: string
  name: string
}

export async function identifySpecies(
  imageUrl: string,
  shortlist: Species[],
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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
  })
  
  return response.text?.trim() ?? 'NO_MATCH'
}