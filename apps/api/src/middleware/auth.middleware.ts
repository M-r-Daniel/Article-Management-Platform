import { createMiddleware } from 'hono/factory';
import { UnauthorizedError } from '../errors';
import { verifyToken } from '../services/auth.service';

export const authMiddleware = createMiddleware<{
  Variables: {
    user: { username: string; role: string };
  };
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized: Missing token');
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload || typeof payload !== 'object' || !('username' in payload)) {
    throw new UnauthorizedError('Unauthorized: Invalid or expired token');
  }

  c.set('user', {
    username: payload['username'] as string,
    role: (payload['role'] as string) || 'admin',
  });

  await next();
});
