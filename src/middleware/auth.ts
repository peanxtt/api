import type { MiddlewareHandler } from 'hono';

import { verifyAccessToken } from '../lib/auth/jwt';
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

  try {
    const identity = await verifyAccessToken(token, c.env);
    c.set('authToken', token);
    c.set('userId', identity.userId);
    c.set('email', identity.email);
  } catch {
    return jsonError(c, 401, 'UNAUTHORIZED', 'Invalid or expired access token.');
  }

  await next();
};

export const forbidCrossUserAccess = (
  actorUserId: string | undefined,
  resourceUserId: string,
) => {
  if (!actorUserId || actorUserId !== resourceUserId) {
    return {
      status: 403 as const,
      code: 'FORBIDDEN',
      error: 'You do not have access to this resource.',
    };
  }

  return null;
};
