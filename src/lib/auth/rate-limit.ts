type LoginAttemptState = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attemptStore = new Map<string, LoginAttemptState>();

const getOrCreateAttemptState = (ip: string, now: number): LoginAttemptState => {
  const existing = attemptStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 0, resetAt: now + WINDOW_MS };
    attemptStore.set(ip, fresh);
    return fresh;
  }

  return existing;
};

export const getClientIp = (headers: Headers): string => {
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0];
    if (firstIp) {
      return firstIp.trim();
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
};

export const getLoginThrottleState = (ip: string) => {
  const now = Date.now();
  const state = getOrCreateAttemptState(ip, now);
  const isBlocked = state.count >= MAX_ATTEMPTS;
  const retryAfterSeconds = isBlocked
    ? Math.max(1, Math.ceil((state.resetAt - now) / 1000))
    : 0;

  return {
    isBlocked,
    retryAfterSeconds,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - state.count),
  };
};

export const recordFailedLoginAttempt = (ip: string) => {
  const now = Date.now();
  const state = getOrCreateAttemptState(ip, now);
  state.count += 1;
  attemptStore.set(ip, state);
};

export const clearLoginAttempts = (ip: string) => {
  attemptStore.delete(ip);
};
