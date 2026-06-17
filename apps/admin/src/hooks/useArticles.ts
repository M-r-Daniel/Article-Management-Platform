import type { Article, CreateArticleInput, UpdateArticleInput } from '@article-platform/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

/**
 * Hook to retrieve a list of all articles, with optional status filtering.
 */
export function useArticles(status?: 'draft' | 'published') {
  return useQuery<Article[]>({
    queryKey: ['articles', status],
    queryFn: () =>
      api.get<Article[]>(status ? `/api/admin/articles?status=${status}` : '/api/admin/articles'),
  });
}

/**
 * Hook to retrieve details for a single article.
 */
export function useArticle(id: number) {
  return useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => api.get<Article>(`/api/admin/articles/${id}`),
    enabled: !Number.isNaN(id) && id > 0,
  });
}

/**
 * Hook to create a new article. Invalidates the list cache on success.
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation<Article, Error, CreateArticleInput>({
    mutationFn: (input) => api.post<Article>('/api/admin/articles', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

/**
 * Hook to update an existing article. Invalidates the list and details cache on success.
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation<Article, Error, { id: number; input: UpdateArticleInput }>({
    mutationFn: ({ id, input }) => api.put<Article>(`/api/admin/articles/${id}`, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.id] });
    },
  });
}

/**
 * Hook to delete an article. Invalidates the list cache on success.
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: (id) => api.delete<{ message: string }>(`/api/admin/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

/**
 * Hook to transition article status to published. Invalidates related caches.
 */
export function usePublishArticle() {
  const queryClient = useQueryClient();
  return useMutation<Article, Error, number>({
    mutationFn: (id) => api.patch<Article>(`/api/admin/articles/${id}/publish`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.id] });
    },
  });
}

/**
 * Hook to transition article status back to draft. Invalidates related caches.
 */
export function useUnpublishArticle() {
  const queryClient = useQueryClient();
  return useMutation<Article, Error, number>({
    mutationFn: (id) => api.patch<Article>(`/api/admin/articles/${id}/unpublish`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.id] });
    },
  });
}
