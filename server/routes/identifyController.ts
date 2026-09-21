import { Request, Response } from 'express'
import { identifySpecies } from '../services/geminiService.ts'
import { getSpeciesShortlist } from '../services/speciesService'
import { uploadImageBuffer } from '../services/cloudinaryService'
import { insertCard } from '../services/cardsService'

export async function identifyController(req: Request, res: Response) {
  const userId = req.auth?.payload?.sub
  const { location } = req.body
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: please log in' })
  }
  
  const file = req.file

  // Step 1: validate BEFORE a bad request reaches Gemini —
  // saves an API call, and gives a much clearer error
  if (!file) {
    return res.status(400).json({ error: 'image file is required' })
  }

  try {
    const imageUrl = await uploadImageBuffer(file.buffer)
    // Step 2: ask Gemini which species this is, constrained to species in our list
    // it stops Gemini from returning a species your hardcoded data doesn't have
    const shortlist = await getSpeciesShortlist() // pulled from seeded data
    const speciesName = await identifySpecies(imageUrl, shortlist)

    if (speciesName === 'NO_MATCH') {
      // 422 = "I understood your request, but couldn't do the thing you asked."
      // Distinct from a 400 (bad request) or 500 (something broke)
      return res
        .status(422)
        .json({ error: 'Could not identify a matching species' })
    }

    // Step 3: Gemini gives back TEXT (a species name), but your database
    // and your teammate's hardcoded data both key off an ID.
    // This lookup is the bridge between "what the AI said" and "what our data knows."
    const matchedSpecies = shortlist.find(
      (s: { name: string }) => s.name.toLowerCase() === speciesName.toLowerCase(),
    )

    if (!matchedSpecies) {
      // This shouldn't normally happen if Gemini followed instructions,
      // but AI responses are never 100% guaranteed to match your exact format —
      // always handle the "it didn't do what I asked" case explicitly.
      return res
        .status(422)
        .json({ error: `Unrecognized species from Gemini: ${speciesName}` })
    }

    // Step 4: build the Card row.
    const card = await insertCard({
      card_name: String(matchedSpecies.name),
      user_id: userId,
      species_id: Number(matchedSpecies.id),
      image_url: imageUrl,
      location: location ?? null,
    })
    return res.status(200).json(card)
  } catch (err) {
    // Catches anything unexpected — Gemini being down, network failure, etc.
    // Logging server-side (not sent to the user) helps you debug later
    // without leaking internal details to the frontend.
    console.error('identifyController error:', err)
    return res
      .status(500)
      .json({ error: 'Something went wrong identifying this photo' })
  }
}