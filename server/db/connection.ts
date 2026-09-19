import { createClient } from '@libsql/client'
import knex from 'knex'

const client = createClient({
  url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./dev.sqlite',
  authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '',
})


const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'postgres://localhost:5432/dummy',
  },
  useNullAsDefault: true,
})

;(db as any).client.runner = function (builder: any) {
  const query = builder.toSQL()
  return {
    async then(resolve: any, reject: any) {
      try {
        const result = await client.execute({
          sql: query.sql,
          args: query.bindings,
        })
        
        if (query.method === 'select' || query.method === 'first') {
          resolve(result.rows)
        } else if (query.method === 'insert') {
          resolve([Number(result.lastInsertRowid)])
        } else {
          resolve(result.rows)
        }
      } catch (err) {
        reject(err)
      }
    },
  }
}

export default db