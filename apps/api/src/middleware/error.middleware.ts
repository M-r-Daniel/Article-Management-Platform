import type { ApiResponse } from '@article-platform/shared';
import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppError } from '../errors';

/**
 * Global error handler middleware.
 *
 * Catches all unhandled errors thrown from route handlers and services.
 * - AppError subclasses are mapped to their defined HTTP status codes.
 * - Unknown errors default to 500 Internal Server Error.
 * - Internal details (stack traces) are logged but never leaked to clients.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  // Structured internal log for diagnostics
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: err.message,
    code: err instanceof AppError ? err.code : 'INTERNAL_ERROR',
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  };
  console.error(JSON.stringify(errorLog));

  // AppError subclasses carry their own status code and safe message
  if (err instanceof AppError) {
    return c.json<ApiResponse<never>>(
      {
        success: false,
        error: err.message,
      },
      err.statusCode as ContentfulStatusCode,
    );
  }

  // Database constraint violations → 400
  if (err.message.includes('NOT NULL') || err.message.includes('constraint')) {
    return c.json<ApiResponse<never>>(
      {
        success: false,
        error: 'Database constraint error: Invalid data provided',
      },
      400,
    );
  }

  // Fallback: never expose internal details to the client
  return c.json<ApiResponse<never>>(
    {
      success: false,
      error: 'Internal Server Error',
    },
    500,
  );
};
