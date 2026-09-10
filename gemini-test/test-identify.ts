// test that gemini can identify a species from a real image
import 'dotenv/config'
import { getSpeciesShortlist } from '../server/services/speciesService'
import { identifySpecies } from '../server/services/geminiService'

async function run() {
  console.log('1. fetching shortlist...')
  const shortlist = await getSpeciesShortlist()
  console.log('2. got shortlist:', shortlist.length, 'species')

  console.log('3. calling gemini...')
  const result = await identifySpecies(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg/250px-Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    shortlist,
  )
  console.log('4. gemini responded:', result)
  process.exit(0)
}

run()
