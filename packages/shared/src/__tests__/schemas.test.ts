import { describe, expect, it } from 'bun:test';
import { createArticleSchema, updateArticleSchema } from '../schemas/article.schema';

describe('createArticleSchema', () => {
  it('passes validation for valid article inputs', () => {
    const validArticle = {
      title: 'Valid Title',
      summary: 'This is a valid summary for the article.',
      content: 'This is a longer body content for the article under test.',
    };
    const result = createArticleSchema.safeParse(validArticle);
    expect(result.success).toBe(true);
  });

  it('fails if title is too short', () => {
    const invalidArticle = {
      title: 'Ab',
      summary: 'This is a valid summary for the article.',
      content: 'This is a longer body content for the article under test.',
    };
    const result = createArticleSchema.safeParse(invalidArticle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('at least 3 characters');
    }
  });

  it('fails if summary is too short', () => {
    const invalidArticle = {
      title: 'Valid Title',
      summary: 'Short',
      content: 'This is a longer body content for the article under test.',
    };
    const result = createArticleSchema.safeParse(invalidArticle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('at least 10 characters');
    }
  });

  it('fails if content is too short', () => {
    const invalidArticle = {
      title: 'Valid Title',
      summary: 'This is a valid summary for the article.',
      content: 'Short',
    };
    const result = createArticleSchema.safeParse(invalidArticle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('at least 10 characters');
    }
  });
});

describe('updateArticleSchema', () => {
  it('passes validation for partial changes', () => {
    const partialUpdate = {
      title: 'New Title',
    };
    const result = updateArticleSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });

  it('passes validation with a valid status', () => {
    const statusUpdate = {
      status: 'published' as const,
    };
    const result = updateArticleSchema.safeParse(statusUpdate);
    expect(result.success).toBe(true);
  });

  it('fails validation with an invalid status', () => {
    const invalidStatusUpdate = {
      status: 'archived',
    };
    const result = updateArticleSchema.safeParse(invalidStatusUpdate);
    expect(result.success).toBe(false);
  });
});
