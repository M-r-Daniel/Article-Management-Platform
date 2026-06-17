import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  summary: z
    .string({
      required_error: 'Summary is required',
    })
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary must not exceed 500 characters')
    .trim(),
  content: z
    .string({
      required_error: 'Content is required',
    })
    .min(10, 'Content must be at least 10 characters')
    .trim(),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  status: z
    .enum(['draft', 'published'], {
      invalid_type_error: "Status must be 'draft' or 'published'",
    })
    .optional(),
});
