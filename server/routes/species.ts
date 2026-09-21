// server/routes/species.ts
import { Router } from 'express'
import { getSpeciesById, getSpeciesShortlist } from '../services/speciesService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const species = await getSpeciesShortlist()
    res.json(species)
  } catch (error) {
    console.error('Error fetching species shortlist:', error)
    res.status(500).json({ error: 'Failed to fetch species list' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const species = await getSpeciesById(req.params.id)
    if (!species) {
      return res.status(404).json({ error: 'Species not found' })
    }
    res.json(species)
  } catch (error) {
    console.error('Error fetching species by ID:', error)
    res.status(500).json({ error: 'Failed to fetch species details' })
  }
})

export default router