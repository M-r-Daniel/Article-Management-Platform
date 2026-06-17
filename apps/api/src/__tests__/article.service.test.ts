import './setup';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { db } from '../db';
import { articles } from '../db/schema';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getPublishedBySlug,
  listArticles,
  listPublishedArticles,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '../services/article.service';

beforeEach(async () => {
  // Clear table before each test
  await db.delete(articles).execute();
});

describe('Article Service', () => {
  it('should create an article in draft status with generated slug', async () => {
    const input = {
      title: 'Test Title Here',
      summary: 'Summary of the test article.',
      content: 'Longer content body for the test article.',
    };

    const article = await createArticle(input);
    expect(article.id).toBeDefined();
    expect(article.title).toBe(input.title);
    expect(article.slug).toBe('test-title-here');
    expect(article.status).toBe('draft');
  });

  it('should deduplicate conflicting slugs', async () => {
    const input = {
      title: 'Unique Title',
      summary: 'Summary goes here.',
      content: 'Content goes here.',
    };

    const first = await createArticle(input);
    const second = await createArticle(input);

    expect(first.slug).toBe('unique-title');
    expect(second.slug).toBe('unique-title-1');
  });

  it('should list articles and respect status filter', async () => {
    const a1 = await createArticle({
      title: 'Article One',
      summary: 'Summary description for article one.',
      content: 'Content body for article one.',
    });
    const a2 = await createArticle({
      title: 'Article Two',
      summary: 'Summary description for article two.',
      content: 'Content body for article two.',
    });

    await publishArticle(a1.id);

    const all = await listArticles();
    expect(all.length).toBe(2);

    const published = await listArticles({ status: 'published' });
    expect(published.length).toBe(1);
    expect(published[0]?.id).toBe(a1.id);

    const drafts = await listArticles({ status: 'draft' });
    expect(drafts.length).toBe(1);
    expect(drafts[0]?.id).toBe(a2.id);
  });

  it('should retrieve article by ID and Slug', async () => {
    const created = await createArticle({
      title: 'Target Article',
      summary: 'Summary details go here.',
      content: 'Content body goes here.',
    });

    const byId = await getArticleById(created.id);
    expect(byId).not.toBeNull();
    expect(byId?.title).toBe('Target Article');

    // Should return null for slug if not published
    const bySlugDraft = await getPublishedBySlug(created.slug);
    expect(bySlugDraft).toBeNull();

    // Publish and try again
    await publishArticle(created.id);
    const bySlugPublished = await getPublishedBySlug(created.slug);
    expect(bySlugPublished).not.toBeNull();
    expect(bySlugPublished?.id).toBe(created.id);
  });

  it('should update article attributes and regenerate slug if title changes', async () => {
    const created = await createArticle({
      title: 'Initial Title',
      summary: 'Initial summary.',
      content: 'Initial content.',
    });

    const updated = await updateArticle(created.id, {
      title: 'Modified Title',
      summary: 'Modified summary.',
    });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe('Modified Title');
    expect(updated?.slug).toBe('modified-title');
    expect(updated?.summary).toBe('Modified summary.');
  });

  it('should delete an article', async () => {
    const created = await createArticle({
      title: 'Delete Me',
      summary: 'Summary details.',
      content: 'Content body.',
    });

    const deleted = await deleteArticle(created.id);
    expect(deleted).toBe(true);

    const found = await getArticleById(created.id);
    expect(found).toBeNull();
  });
});
