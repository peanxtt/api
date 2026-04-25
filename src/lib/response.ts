import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { AppEnv } from '../types/bindings';

export type ApiErrorPayload = {
  code: string;
  message: string;
};

export const successResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const errorResponse = (code: string, message: string) => ({
  success: false as const,
  error: {
    code,
    message,
  },
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
  message: string,
) => c.json(errorResponse(code, message), status);
