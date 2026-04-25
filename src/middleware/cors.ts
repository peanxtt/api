import type { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';

import { parseEnv } from '../config/env';
import type { AppEnv } from '../types/bindings';

const parseOrigins = (origins: string): string[] =>
  origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const corsMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const { FRONTEND_ORIGINS } = parseEnv(c.env);
  const allowList = parseOrigins(FRONTEND_ORIGINS);

  const handler = cors({
    origin: (origin) => {
      if (allowList.includes('*')) {
        return '*';
      }

      if (!origin) {
        return allowList[0] ?? '*';
      }

      return allowList.includes(origin) ? origin : allowList[0] ?? '*';
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  });

  return handler(c, next);
};
