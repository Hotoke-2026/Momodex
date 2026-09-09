import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function testIdentify() {
  const base64Image = fs.readFileSync('gemini-test/test-image.jpg', {
    encoding: 'base64',
  })

  const contents = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    },
    {
      text: 'What New Zealand species is shown in this photo? Just give the species name.',
    },
  ]

  console.log(
    'Me: What New Zealand species is shown in this photo? Just give the species name.',
  )
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: contents,
  })

  console.log('Gemini:', response.text)
}

testIdentify().catch(console.error)
