import type { ApiResponse } from '@article-platform/shared';
import { getToken, logout } from './auth';

/**
 * Generic fetch request wrapper. Automatically injects authorization
 * headers and handles standard error checks.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(path, config);

  // Automatically terminate session on 401 Unauthorized responses
  if (response.status === 401 && !path.includes('/auth/login')) {
    logout();
    throw new Error('Session expired. Please log in again.');
  }

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
    // Return empty payload mapped to T if data is empty (like for DELETE results)
    return {} as T;
  }

  return result.data;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, options?: RequestInit) => {
    const config: RequestInit = { ...options, method: 'PATCH' };
    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }
    return request<T>(path, config);
  },
  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
export default api;
