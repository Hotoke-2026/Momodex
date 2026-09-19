import { describe, it, expect, afterAll } from 'vitest';
import db from './db';

describe('SQLite Database Connection', () => {
  afterAll(async () => {
    db.close();
  });

  it('should successfully execute a test query', async () => {
    const result = await db.execute('SELECT 1 + 1 AS result');
    
    expect(result).toBeDefined();
    expect(result.rows[0].result).toBe(2);
  });
});