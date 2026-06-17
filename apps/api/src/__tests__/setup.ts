import { Database } from 'bun:sqlite';
import { join } from 'node:path';

const defaultDbPath = join(import.meta.dir, '../../sqlite_test.db');
const dbPath = process.env['DATABASE_URL'] || defaultDbPath;
const sqlite = new Database(dbPath);

try {
  // Drop table to ensure a clean, updated schema for tests
  sqlite.run('DROP TABLE IF EXISTS articles;');
  
  sqlite.run(`
    CREATE TABLE articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT CHECK(status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
      views INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  sqlite.run('CREATE UNIQUE INDEX slug_idx ON articles (slug);');
  sqlite.run('CREATE INDEX status_idx ON articles (status);');
} catch (error) {
  console.error('Failed to initialize test SQLite database schema:', error);
} finally {
  sqlite.close();
}
