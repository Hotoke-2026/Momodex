import { Router } from 'express'
import { getSpeciesById } from '../services/speciesService'

const router = Router()

router.get('/:id', async (req, res) => {
  const species = await getSpeciesById(req.params.id)
  if (!species) {
    return res.status(404).json({ error: 'Species not found' })
  }
  res.json(species)
})

export default router
