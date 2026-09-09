import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, './dev.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
  },
};

export default config;