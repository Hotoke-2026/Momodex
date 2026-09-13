// client/apis/users.ts
import request from 'superagent'

export interface User {
  id: string
  name: string
}

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(id: string) {
  const response = await request.get(`${rootURL}/users/${id}`)
  return response.body as User
}
