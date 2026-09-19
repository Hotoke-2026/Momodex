import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

if (!url) {
  throw new Error('Database URL is missing. Please set DATABASE_URL or TURSO_DATABASE_URL environment variables.')
}

const db = createClient({
  url,
  authToken,
})

export default db