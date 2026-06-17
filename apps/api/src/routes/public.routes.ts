import type { ApiResponse, Article } from '@article-platform/shared';
import { Hono } from 'hono';
import { NotFoundError } from '../errors';
import { getPublishedBySlug, listPublishedArticles } from '../services/article.service';

export const publicRouter = new Hono();

// 1. Get all published articles
publicRouter.get('/articles/public', async (c) => {
  const list = await listPublishedArticles();
  return c.json<ApiResponse<Article[]>>({
    success: true,
    data: list,
  });
});

// 2. Get a single published article by slug
publicRouter.get('/articles/public/:slug', async (c) => {
  const slug = c.req.param('slug');
  const article = await getPublishedBySlug(slug);

  if (!article) {
    throw new NotFoundError('Article', slug);
  }

  return c.json<ApiResponse<Article>>({
    success: true,
    data: article,
  });
});
