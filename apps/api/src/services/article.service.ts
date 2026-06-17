import { generateSlug } from '@article-platform/shared';
import type { Article, CreateArticleInput, UpdateArticleInput } from '@article-platform/shared';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { articles } from '../db/schema';

/**
 * Retrieves a list of all articles, optionally filtered by status.
 *
 * @param filter Optional filter object containing the status of articles to fetch
 * @returns A promise that resolves to an array of articles
 */
export async function listArticles(filter?: { status?: 'draft' | 'published' }): Promise<
  Article[]
> {
  if (filter?.status) {
    return db.select().from(articles).where(eq(articles.status, filter.status)).execute();
  }
  return db.select().from(articles).execute();
}

/**
 * Retrieves a list of all published articles.
 *
 * @returns A promise that resolves to an array of published articles
 */
export async function listPublishedArticles(): Promise<Article[]> {
  return db.select().from(articles).where(eq(articles.status, 'published')).execute();
}

/**
 * Retrieves a single article by its database ID.
 *
 * @param id The ID of the article to retrieve
 * @returns A promise that resolves to the article, or null if not found
 */
export async function getArticleById(id: number): Promise<Article | null> {
  const results = await db.select().from(articles).where(eq(articles.id, id)).execute();
  return results[0] ?? null;
}

/**
 * Retrieves a published article by its unique slug.
 *
 * @param slug The slug of the article to retrieve
 * @returns A promise that resolves to the article, or null if not found or not published
 */
export async function getPublishedBySlug(slug: string): Promise<Article | null> {
  const results = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .execute();
  return results[0] ?? null;
}

/**
 * Creates a new article in draft status.
 * Generates a unique slug based on the title.
 *
 * @param input The article attributes to insert
 * @returns A promise that resolves to the newly created article
 */
export async function createArticle(input: CreateArticleInput): Promise<Article> {
  const baseSlug = generateSlug(input.title);
  let finalSlug = baseSlug;
  let counter = 1;

  // Resolve slug conflicts
  while (true) {
    const existing = await db.select().from(articles).where(eq(articles.slug, finalSlug)).execute();
    if (existing.length === 0) break;
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const results = await db
    .insert(articles)
    .values({
      title: input.title,
      slug: finalSlug,
      summary: input.summary,
      content: input.content,
      status: 'draft',
    })
    .returning()
    .execute();

  const created = results[0];
  if (!created) {
    throw new Error('Failed to create article record');
  }

  return created;
}

/**
 * Updates an existing article's attributes.
 * If the title is changed, a new unique slug is generated.
 *
 * @param id The ID of the article to update
 * @param input The partial article attributes to update
 * @returns A promise that resolves to the updated article, or null if not found
 */
export async function updateArticle(
  id: number,
  input: UpdateArticleInput,
): Promise<Article | null> {
  const updateValues: Partial<typeof articles.$inferInsert> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.title !== undefined) updateValues.title = input.title;
  if (input.summary !== undefined) updateValues.summary = input.summary;
  if (input.content !== undefined) updateValues.content = input.content;
  if (input.status !== undefined) updateValues.status = input.status;

  if (input.title) {
    const baseSlug = generateSlug(input.title);
    let finalSlug = baseSlug;
    let counter = 1;

    // Resolve slug conflicts, excluding current article ID
    while (true) {
      const existing = await db
        .select()
        .from(articles)
        .where(eq(articles.slug, finalSlug))
        .execute();
      const conflict = existing.find((a) => a.id !== id);
      if (!conflict) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    updateValues.slug = finalSlug;
  }

  const results = await db
    .update(articles)
    .set(updateValues)
    .where(eq(articles.id, id))
    .returning()
    .execute();

  return results[0] ?? null;
}

/**
 * Deletes an article by its ID.
 *
 * @param id The ID of the article to delete
 * @returns A promise that resolves to true if deleted, false if not found
 */
export async function deleteArticle(id: number): Promise<boolean> {
  const results = await db.delete(articles).where(eq(articles.id, id)).returning().execute();
  return results.length > 0;
}

/**
 * Updates an article's status to 'published'.
 *
 * @param id The ID of the article to publish
 * @returns A promise that resolves to the updated article, or null if not found
 */
export async function publishArticle(id: number): Promise<Article | null> {
  const results = await db
    .update(articles)
    .set({ status: 'published', updatedAt: new Date().toISOString() })
    .where(eq(articles.id, id))
    .returning()
    .execute();
  return results[0] ?? null;
}

/**
 * Reverts an article's status to 'draft'.
 *
 * @param id The ID of the article to unpublish
 * @returns A promise that resolves to the updated article, or null if not found
 */
export async function unpublishArticle(id: number): Promise<Article | null> {
  const results = await db
    .update(articles)
    .set({ status: 'draft', updatedAt: new Date().toISOString() })
    .where(eq(articles.id, id))
    .returning()
    .execute();
  return results[0] ?? null;
}
