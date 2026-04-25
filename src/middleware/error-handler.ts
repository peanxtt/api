import type { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { jsonError } from '../lib/response';
import type { AppEnv } from '../types/bindings';

export const registerErrorHandler = (app: Hono<AppEnv>) => {
  app.notFound((c) => jsonError(c, 404, 'NOT_FOUND', 'Route not found'));

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return jsonError(c, err.status, 'HTTP_ERROR', err.message);
    }

    if (err instanceof ZodError) {
      return jsonError(c, 400, 'VALIDATION_ERROR', err.message);
    }

    console.error('Unhandled error:', err);

    return jsonError(c, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.');
  });
};
