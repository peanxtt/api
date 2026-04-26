import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { AppEnv } from '../types/bindings';

export type ApiErrorDetails = {
  fieldErrors?: Record<string, string[]>;
  [key: string]: unknown;
};

export const successResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const errorResponse = (
  error: string,
  code: string,
  details?: ApiErrorDetails,
) => ({
  success: false as const,
  error,
  code,
  ...(details ? { details } : {}),
});

export const jsonSuccess = <T>(
  c: Context<AppEnv>,
  data: T,
  status: ContentfulStatusCode = 200,
) => c.json(successResponse(data), status);

export const jsonError = (
  c: Context<AppEnv>,
  status: ContentfulStatusCode,
  code: string,
  error: string,
  details?: ApiErrorDetails,
) => c.json(errorResponse(error, code, details), status);
