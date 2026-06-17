/**
 * Custom Application Error hierarchy.
 * Provides structured, type-safe error handling that maps
 * domain-level exceptions to HTTP status codes automatically.
 *
 * @module errors
 */

/**
 * Base application error. All custom errors extend this class
 * to enable centralized handling in the error middleware.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Thrown when a requested resource cannot be found.
 * Maps to HTTP 404.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string | number) {
    super(404, `${resource} with identifier '${identifier}' was not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when client input fails validation rules.
 * Maps to HTTP 400.
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when authentication credentials are missing or invalid.
 * Maps to HTTP 401.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

/**
 * Thrown when a data conflict occurs (e.g., duplicate slug).
 * Maps to HTTP 409.
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}
