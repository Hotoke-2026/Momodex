import { createClient } from '@libsql/client'
import knex from 'knex'

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.DATABASE_URL)

const client = createClient({
  url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./dev.sqlite',
  authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '',
})

const db = knex({
  client: isProduction ? 'sqlite3' : 'sqlite3',
  connection: isProduction
    ? {
        filename: ':memory:', 
      }
    : {
        filename: './dev.sqlite',
      },
  useNullAsDefault: true,
})

export default db