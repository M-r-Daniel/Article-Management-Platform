import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { errorHandler } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { adminRouter } from './routes/admin.routes';
import { publicRouter } from './routes/public.routes';

const app = new Hono();

// Global Middlewares
app.use('*', secureHeaders());

const corsOrigin = process.env['CORS_ORIGIN'] || '*';
app.use(
  '*',
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

app.use('*', loggerMiddleware);
app.onError(errorHandler);

// API Routes mounting
app.route('/api/admin', adminRouter);
app.route('/api', publicRouter);

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'OK', timestamp: new Date().toISOString() }));

const port = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;

export default {
  port,
  fetch: app.fetch,
};

