// server/routes/identifyController.ts

import { Request, Response } from 'express'
import { identifySpecies } from '../services/geminiService.ts'
import { getSpeciesShortlist } from '../services/speciesService'
import { Card } from '../../models/types' // your interface

interface IdentifyRequestBody {
  imageUrl: string
  userId: string
  location?: string
}

export async function identifyController(req: Request, res: Response) {
  const { imageUrl, userId, location } = req.body as IdentifyRequestBody

  // Step 1: validate BEFORE doing any expensive work.
  // Failing fast here means a bad request never even reaches Gemini —
  // saves you an API call, and gives a much clearer error than
  // a confusing crash three functions deep.
  if (!imageUrl || !userId) {
    return res.status(400).json({ error: 'imageUrl and userId are required' })
  }

  try {
    // Step 2: ask Gemini which species this is, constrained to species we actually know about
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
      (s) => s.name.toLowerCase() === speciesName.toLowerCase(),
    )

    if (!matchedSpecies) {
      // This shouldn't normally happen if Gemini followed instructions,
      // but AI responses are never 100% guaranteed to match your exact format —
      // always handle the "it didn't do what I asked" case explicitly.
      return res
        .status(422)
        .json({ error: `Unrecognized species from Gemini: ${speciesName}` })
    }

    // Step 4: build the Card row. Note this matches your interface exactly —
    // this route's ONLY job is producing this shape correctly.
    const card: Card = {
      id: Date.now(), // TEMPORARY — replace with your DB's auto-generated id once that's wired up
      user_id: userId,
      species_id: matchedSpecies.id,
      image_url: imageUrl,
      location: location ?? null,
      created_at: new Date().toISOString(),
    }

    // TODO: once the database is ready, insert `card` there instead of
    // just returning it — for now this lets your teammates build against
    // a real response shape before that piece exists.

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
