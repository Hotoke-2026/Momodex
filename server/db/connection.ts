import { createClient } from '@libsql/client'
import { knex } from 'knex'

const client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN || '',
})

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_URL || './sqlite.db',
  },
  useNullAsDefault: true,
})

export default db