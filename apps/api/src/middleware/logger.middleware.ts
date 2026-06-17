import { createMiddleware } from 'hono/factory';

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  const { method, path } = c.req;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  const logEntry = {
    timestamp: new Date().toISOString(),
    method,
    path,
    status,
    durationMs: duration,
  };

  // Structured production logger
  console.info(JSON.stringify(logEntry));
});
