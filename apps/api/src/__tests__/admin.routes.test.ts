import './setup';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { articles } from '../db/schema';
import apiApp from '../index';

let adminToken = '';

beforeAll(async () => {
  // Obtain a valid JWT for subsequent admin endpoints
  const loginRequest = new Request('http://localhost/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const loginResponse = await apiApp.fetch(loginRequest);
  const loginBody = await loginResponse.json();
  adminToken = loginBody.data.token;
});

beforeEach(async () => {
  await db.delete(articles).execute();
});

describe('Admin API Routes', () => {
  it('should reject requests without a JWT token', async () => {
    const req = new Request('http://localhost/api/admin/articles', {
      method: 'GET',
    });
    const res = await apiApp.fetch(req);
    expect(res.status).toBe(401);
  });

  it('POST /api/admin/articles - should create new draft', async () => {
    const payload = {
      title: 'Monorepo Architecture Overview',
      summary: 'A short description about workspaces.',
      content: 'A detailed article body about setup.',
    };

    const req = new Request('http://localhost/api/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await apiApp.fetch(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe('monorepo-architecture-overview');
    expect(body.data.status).toBe('draft');
  });

  it('GET /api/admin/articles - should list all articles', async () => {
    await db
      .insert(articles)
      .values({
        title: 'Article Example',
        slug: 'article-example',
        summary: 'Summary text.',
        content: 'Content text.',
        status: 'draft',
      })
      .execute();

    const req = new Request('http://localhost/api/admin/articles', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const res = await apiApp.fetch(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(1);
  });

  it('PUT /api/admin/articles/:id - should modify details', async () => {
    const results = await db
      .insert(articles)
      .values({
        title: 'Original Title',
        slug: 'original-title',
        summary: 'Original summary text.',
        content: 'Original content.',
        status: 'draft',
      })
      .returning()
      .execute();

    const record = results[0];
    expect(record).toBeDefined();

    const payload = {
      title: 'Completely New Title',
    };

    const req = new Request(`http://localhost/api/admin/articles/${record!.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await apiApp.fetch(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('Completely New Title');
    expect(body.data.slug).toBe('completely-new-title');
  });

  it('PATCH /api/admin/articles/:id/publish - should change status to published', async () => {
    const results = await db
      .insert(articles)
      .values({
        title: 'Release Draft',
        slug: 'release-draft',
        summary: 'Summary details.',
        content: 'Content text.',
        status: 'draft',
      })
      .returning()
      .execute();

    const record = results[0];

    const req = new Request(`http://localhost/api/admin/articles/${record!.id}/publish`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const res = await apiApp.fetch(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('published');
  });

  it('DELETE /api/admin/articles/:id - should remove records', async () => {
    const results = await db
      .insert(articles)
      .values({
        title: 'Delete Draft',
        slug: 'delete-draft',
        summary: 'Summary.',
        content: 'Content.',
        status: 'draft',
      })
      .returning()
      .execute();

    const record = results[0];

    const req = new Request(`http://localhost/api/admin/articles/${record!.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const res = await apiApp.fetch(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);

    const check = await db.select().from(articles).where(eq(articles.id, record!.id)).execute();
    expect(check.length).toBe(0);
  });
});
