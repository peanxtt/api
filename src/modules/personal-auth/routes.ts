import { Hono } from 'hono';

import {
  clearLoginAttempts,
  getClientIp,
  getLoginThrottleState,
  recordFailedLoginAttempt,
} from '../../lib/auth/rate-limit';
import { jsonError, jsonSuccess } from '../../lib/response';
import { validateJson } from '../../lib/validation';
import { authGuard } from '../../middleware/auth';
import type { AppEnv } from '../../types/bindings';
import { loginRequestSchema } from './schema';
import { AuthServiceError, getAuthenticatedUser, loginWithPassword, logoutSession } from './service';

const personalAuthRoutes = new Hono<AppEnv>();

personalAuthRoutes.post('/auth/login', validateJson(loginRequestSchema), async (c) => {
  const ip = getClientIp(c.req.raw.headers);
  const throttle = getLoginThrottleState(ip);

  if (throttle.isBlocked) {
    return jsonError(
      c,
      429,
      'TOO_MANY_REQUESTS',
      'Too many login attempts. Please try again later.',
      { retryAfterSeconds: throttle.retryAfterSeconds },
    );
  }

  const body = c.req.valid('json');

  try {
    const loginResult = await loginWithPassword(c.env, body);
    clearLoginAttempts(ip);
    return jsonSuccess(c, loginResult);
  } catch (error) {
    if (error instanceof AuthServiceError && error.status === 401) {
      recordFailedLoginAttempt(ip);
      return jsonError(c, 401, 'UNAUTHORIZED', error.message);
    }

    throw error;
  }
});

personalAuthRoutes.post('/auth/logout', authGuard, async (c) => {
  const accessToken = c.get('authToken');

  if (!accessToken) {
    return jsonError(c, 401, 'UNAUTHORIZED', 'Missing authenticated session token.');
  }

  await logoutSession(c.env, accessToken);
  return jsonSuccess(c, { message: 'Logged out successfully' });
});

personalAuthRoutes.get('/auth/me', authGuard, async (c) => {
  const accessToken = c.get('authToken');
  const userId = c.get('userId');
  const email = c.get('email');

  if (!accessToken || !userId || !email) {
    return jsonError(c, 401, 'UNAUTHORIZED', 'Missing authenticated identity context.');
  }

  const user = await getAuthenticatedUser(c.env, accessToken, { userId, email });
  return jsonSuccess(c, user);
});

export default personalAuthRoutes;
