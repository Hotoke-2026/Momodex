import { createClient } from '@libsql/client'
import knex from 'knex'

const client = createClient({
  url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./dev.sqlite',
  authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '',
})

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || './dev.sqlite',
  },
  pool: {
    afterCreate: (conn: any, done: Function) => {
      done()
    },
  },
  useNullAsDefault: true,
})

;(db as any).client.driver = client

export default db