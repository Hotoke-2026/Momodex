// get species data from the database
import { Router } from 'express'
import { getSpeciesById, getSpeciesShortlist } from '../services/speciesService'

const router = Router()

router.get('/', async (req, res) => {
  const species = await getSpeciesShortlist()
  res.json(species)
})

router.get('/:id', async (req, res) => {
  const species = await getSpeciesById(req.params.id)
  if (!species) {
    return res.status(404).json({ error: 'Species not found' })
  }
  res.json(species)
})

export default router
