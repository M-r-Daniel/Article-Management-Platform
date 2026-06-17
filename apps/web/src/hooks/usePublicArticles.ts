import type { ApiResponse, Article } from '@article-platform/shared';
import { useQuery } from '@tanstack/react-query';

/**
 * Common public request helper. Handles standard error unwrapping.
 */
async function fetchPublic<T>(path: string): Promise<T> {
  const response = await fetch(path);

  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch (error) {
    throw new Error(`Failed to parse response payload: ${response.statusText}`);
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || `Request failed with status: ${response.status}`);
  }

  if (result.data === undefined) {
    throw new Error('Response payload has no data attributes');
  }

  return result.data;
}

/**
 * Hook to retrieve all published articles.
 */
export function usePublishedArticles() {
  return useQuery<Article[]>({
    queryKey: ['public-articles'],
    queryFn: () => fetchPublic<Article[]>('/api/articles/public'),
  });
}

/**
 * Hook to retrieve details for a single published article by slug.
 */
export function useArticleBySlug(slug: string) {
  return useQuery<Article>({
    queryKey: ['public-article', slug],
    queryFn: () => fetchPublic<Article>(`/api/articles/public/${slug}`),
    enabled: !!slug,
  });
}
export default usePublishedArticles;
