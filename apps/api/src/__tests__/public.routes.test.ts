import './setup';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { db } from '../db';
import { articles } from '../db/schema';
import apiApp from '../index';

beforeEach(async () => {
  await db.delete(articles).execute();
});

describe('Public API Routes', () => {
  it('GET /api/articles/public - should return only published articles', async () => {
    // Insert one draft and one published article
    await db
      .insert(articles)
      .values({
        title: 'Draft Article',
        slug: 'draft-article',
        summary: 'A short summary of a draft.',
        content: 'Draft content goes here.',
        status: 'draft',
      })
      .execute();

    await db
      .insert(articles)
      .values({
        title: 'Published Article',
        slug: 'published-article',
        summary: 'A short summary of a published article.',
        content: 'Published content goes here.',
        status: 'published',
      })
      .execute();

    const response = await apiApp.fetch(new Request('http://localhost/api/articles/public'));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBe(1);
    expect(body.data[0].slug).toBe('published-article');
  });

  it('GET /api/articles/public/:slug - should retrieve article details by slug', async () => {
    await db
      .insert(articles)
      .values({
        title: 'Read Me',
        slug: 'read-me',
        summary: 'Important summary.',
        content: 'Important content.',
        status: 'published',
      })
      .execute();

    const response = await apiApp.fetch(
      new Request('http://localhost/api/articles/public/read-me'),
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('Read Me');
  });

  it('GET /api/articles/public/:slug - should return 404 for draft slugs', async () => {
    await db
      .insert(articles)
      .values({
        title: 'Secret Draft',
        slug: 'secret-draft',
        summary: 'Draft summary.',
        content: 'Draft content.',
        status: 'draft',
      })
      .execute();

    const response = await apiApp.fetch(
      new Request('http://localhost/api/articles/public/secret-draft'),
    );
    expect(response.status).toBe(404);
  });
});
