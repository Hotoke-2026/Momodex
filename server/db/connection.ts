import knex from 'knex'

const db = knex({
  client: 'sqlite3',
  connection: process.env.DATABASE_URL?.startsWith('libsql://') || process.env.TURSO_DATABASE_URL
    ? {
        filename: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || '',
        ...(process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN
          ? { authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN }
          : {}),
      }
    : {
        filename: process.env.DATABASE_URL || './dev.sqlite',
      },
  useNullAsDefault: true,
})

export default db