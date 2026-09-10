// server/services/geminiService.ts

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
  // Gemini needs actual image BYTES, not just a URL sitting in a text prompt —
  // it can't "click a link." So we fetch the image ourselves first.
  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()
  const base64Image = Buffer.from(imageBuffer).toString('base64')

  const speciesNames = shortlist.map((s) => s.name)

  // Being VERY explicit in the prompt about the exact expected output format
  // is what makes the string-matching in the route handler actually reliable.
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
    model: 'gemini-3.6-flash',
    contents,
  })
  console.log(response.text)
  return response.text?.trim() ?? 'NO_MATCH'
}
