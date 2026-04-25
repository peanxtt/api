import type { MiddlewareHandler } from 'hono';

import { jsonError } from '../lib/response';
import type { AppEnv } from '../types/bindings';

export const authGuard: MiddlewareHandler<AppEnv> = async (c, next) => {
  const authorizationHeader = c.req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return jsonError(c, 401, 'UNAUTHORIZED', 'Missing or invalid Authorization header.');
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    return jsonError(c, 401, 'UNAUTHORIZED', 'Bearer token is missing.');
  }

  // TODO: Verify Supabase JWT signature/claims using SUPABASE_JWT_SECRET.
  c.set('authToken', token);

  await next();
};
