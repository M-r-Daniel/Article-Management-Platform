import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { errorHandler } from '../middleware/error.middleware';
import { login } from '../services/auth.service';

describe('Auth Middleware', () => {
  // Setup isolated Hono app for middleware tests
  const app = new Hono<{
    Variables: {
      user: { username: string; role: string };
    };
  }>();

  app.onError(errorHandler);
  app.use('/protected', authMiddleware);
  app.get('/protected', (c) => {
    return c.json({ success: true, user: c.get('user') });
  });

  it('should return 401 Unauthorized when Authorization header is missing', async () => {
    const res = await app.request('/protected', {
      method: 'GET',
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      success: false,
      error: 'Unauthorized: Missing token',
    });
  });

  it('should return 401 Unauthorized when token is invalid or expired', async () => {
    const res = await app.request('/protected', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalid-token-string',
      },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      success: false,
      error: 'Unauthorized: Invalid or expired token',
    });
  });

  it('should pass authentication and populate c.get("user") with valid token', async () => {
    // Generate a valid token
    const loginResult = await login('admin', 'admin123');
    expect(loginResult).not.toBeNull();
    const token = loginResult!.token;

    const res = await app.request('/protected', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user).toEqual({
      username: 'admin',
      role: 'admin',
    });
  });
});
