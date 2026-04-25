import type { MiddlewareHandler } from 'hono';

import type { AppEnv } from '../types/bindings';

export const requestLogger: MiddlewareHandler<AppEnv> = async (c, next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  const path = new URL(c.req.url).pathname;

  console.log(`${c.req.method} ${path} -> ${c.res.status} (${duration}ms)`);
};
