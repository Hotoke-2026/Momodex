import { auth } from 'express-oauth2-jwt-bearer'
import dotenv from 'dotenv'

dotenv.config()

const domain = process.env.AUTH0_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const audience = process.env.AUTH0_AUDIENCE

if (!domain) {
  throw new Error('Missing required environment variable: AUTH0_DOMAIN')
}

if (!audience) {
  throw new Error('Missing required environment variable: AUTH0_AUDIENCE')
}

export const checkJwt = auth({
  audience,
  issuerBaseURL: `https://${domain}/`,
  tokenSigningAlg: 'RS256',
})