import { describe, it, expect, afterAll } from 'vitest';
import db from './db';

describe('SQLite Database Connection', () => {
  afterAll(async () => {
  
    await db.destroy();
  });

  it('should successfully execute a test query', async () => {
    const result = await db.raw('SELECT 1 + 1 AS result');
    
    expect(result).toBeDefined();
    expect(result[0].result).toBe(2);
  });
});