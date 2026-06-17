import { Database } from 'bun:sqlite';
import { join } from 'node:path';

console.log('🔄 Running database migrations...');

const isTest = process.env['NODE_ENV'] === 'test';
const defaultDbName = isTest ? 'sqlite_test.db' : 'sqlite.db';
const defaultDbPath = join(import.meta.dir, '../../', defaultDbName);

const dbPath = process.env['DATABASE_URL'] || defaultDbPath;
const db = new Database(dbPath);

try {
  // Create articles table matching schema
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
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

  // Check if views column exists (for migrating existing databases), if not, add it
  const tableInfo = db.prepare("PRAGMA table_info(articles)").all() as { name: string }[];
  const hasViews = tableInfo.some((col) => col.name === 'views');
  if (!hasViews) {
    db.run('ALTER TABLE articles ADD COLUMN views INTEGER NOT NULL DEFAULT 0;');
    console.log('🔌 Dynamic Migration: Added missing column "views" to articles table.');
  }

  // Create indexes for performance
  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS slug_idx ON articles (slug);
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS status_idx ON articles (status);
  `);

  console.log('✅ Database migration completed successfully.');
} catch (error) {
  console.error('❌ Database migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
