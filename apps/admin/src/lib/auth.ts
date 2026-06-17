const TOKEN_KEY = 'article_platform_admin_token';

/**
 * Saves the JWT authentication token to localStorage.
 *
 * @param token The JWT signed token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the JWT token from localStorage.
 *
 * @returns The token string or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Clears the JWT token from localStorage.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Evaluates whether the user is authenticated by verifying
 * the existence and expiration time of the JWT token in storage.
 *
 * @returns Boolean representing authentication state
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode base64 URL payload
    const base64Url = parts[1] || '';
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    const payload = JSON.parse(jsonPayload);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      removeToken(); // Self-clean expired token
      return false;
    }

    return true;
  } catch (error) {
    removeToken();
    return false;
  }
}

/**
 * Discards the current session credentials and redirects to login page.
 */
export function logout(): void {
  removeToken();
  // Safe redirect in browser
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
