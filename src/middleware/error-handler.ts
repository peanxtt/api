import type { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { jsonError } from '../lib/response';
import type { AppEnv } from '../types/bindings';

const normalizeFieldErrors = (
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> | undefined => {
  const normalizedEntries = Object.entries(fieldErrors).filter(
    (entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0,
  );

  if (normalizedEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(normalizedEntries);
};

const getCodeByStatus = (status: number) => {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  return 'INTERNAL_ERROR';
};

export const registerErrorHandler = (app: Hono<AppEnv>) => {
  app.notFound((c) => jsonError(c, 404, 'NOT_FOUND', 'Route not found'));

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return jsonError(c, err.status, getCodeByStatus(err.status), err.message);
    }

    if (err instanceof ZodError) {
      const fieldErrors = normalizeFieldErrors(err.flatten().fieldErrors);
      return jsonError(c, 400, 'BAD_REQUEST', 'Validation failed', {
        ...(fieldErrors ? { fieldErrors } : {}),
      });
    }

    console.error('Unhandled error:', err);

    return jsonError(c, 500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  });
};
