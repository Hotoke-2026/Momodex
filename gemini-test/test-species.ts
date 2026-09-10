// tests getting the species list from db
import { getSpeciesShortlist } from '../server/services/speciesService'

async function run() {
  const shortlist = await getSpeciesShortlist()
  console.log(shortlist)
  process.exit(0)
}

run()
