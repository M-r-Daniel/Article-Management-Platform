import { createArticleSchema, updateArticleSchema } from '@article-platform/shared';
import type { ApiResponse, Article } from '@article-platform/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  listArticles,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '../services/article.service';
import { login } from '../services/auth.service';

export const adminRouter = new Hono<{
  Variables: {
    user: { username: string; role: string };
  };
}>();

const loginSchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

// 1. Unprotected auth login route
adminRouter.post('/auth/login', zValidator('json', loginSchema), async (c) => {
  const { username, password } = c.req.valid('json');
  const result = await login(username, password);

  if (!result) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return c.json<ApiResponse<{ token: string }>>({
    success: true,
    data: result,
  });
});

// 2. Protect all subsequent routes in this router
adminRouter.use(authMiddleware);

// 3. Articles listing and filtering
adminRouter.get('/articles', async (c) => {
  const statusQuery = c.req.query('status');
  const status = statusQuery === 'draft' || statusQuery === 'published' ? statusQuery : undefined;

  const list = await listArticles(status ? { status } : undefined);
  return c.json<ApiResponse<Article[]>>({
    success: true,
    data: list,
  });
});

// 4. Get individual article
adminRouter.get('/articles/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    throw new ValidationError('Invalid ID format');
  }

  const article = await getArticleById(id);
  if (!article) {
    throw new NotFoundError('Article', id);
  }

  return c.json<ApiResponse<Article>>({
    success: true,
    data: article,
  });
});

// 5. Create new article (draft status by default)
adminRouter.post('/articles', zValidator('json', createArticleSchema), async (c) => {
  const body = c.req.valid('json');
  const article = await createArticle(body);

  return c.json<ApiResponse<Article>>(
    {
      success: true,
      data: article,
    },
    201,
  );
});

// 6. Update existing article attributes
adminRouter.put('/articles/:id', zValidator('json', updateArticleSchema), async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    throw new ValidationError('Invalid ID format');
  }

  const body = c.req.valid('json');
  const article = await updateArticle(id, body);
  if (!article) {
    throw new NotFoundError('Article', id);
  }

  return c.json<ApiResponse<Article>>({
    success: true,
    data: article,
  });
});

// 7. Delete article
adminRouter.delete('/articles/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    throw new ValidationError('Invalid ID format');
  }

  const deleted = await deleteArticle(id);
  if (!deleted) {
    throw new NotFoundError('Article', id);
  }

  return c.json<ApiResponse<{ message: string }>>({
    success: true,
    data: { message: 'Article deleted successfully' },
  });
});

// 8. Publish article
adminRouter.patch('/articles/:id/publish', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    throw new ValidationError('Invalid ID format');
  }

  const article = await publishArticle(id);
  if (!article) {
    throw new NotFoundError('Article', id);
  }

  return c.json<ApiResponse<Article>>({
    success: true,
    data: article,
  });
});

// 9. Unpublish article
adminRouter.patch('/articles/:id/unpublish', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    throw new ValidationError('Invalid ID format');
  }

  const article = await unpublishArticle(id);
  if (!article) {
    throw new NotFoundError('Article', id);
  }

  return c.json<ApiResponse<Article>>({
    success: true,
    data: article,
  });
});
