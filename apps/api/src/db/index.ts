import { Database } from 'bun:sqlite';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const isTest = process.env['NODE_ENV'] === 'test';
const defaultDbName = isTest ? 'sqlite_test.db' : 'sqlite.db';
const defaultDbPath = join(import.meta.dir, '../../', defaultDbName);

const sqlite = new Database(process.env['DATABASE_URL'] || defaultDbPath);

export const db = drizzle(sqlite, { schema });
