import request from 'superagent'
import type { Species } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getAllSpecies() {
  const response = await request.get(`${rootURL}/species`)
  return response.body as { id: string; name: string }[]
}

export async function getSpeciesById(id: string) {
  const response = await request.get(`${rootURL}/species/${id}`)
  return response.body as Species
}