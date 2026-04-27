import { z } from 'zod';

import type { Bindings } from '../types/bindings';

const envSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  PERSONAL_DATABASE_URL: z.string().url().optional(),
  PERSONAL_DIRECT_URL: z.string().url().optional(),
  COFFEE_DATABASE_URL: z.string().url().optional(),
  COFFEE_DIRECT_URL: z.string().url().optional(),
  FRONTEND_ORIGINS: z.string().default('*'),
});

export type RuntimeEnv = z.infer<typeof envSchema>;

export const parseEnv = (bindings: Bindings): RuntimeEnv => {
  const parsed = envSchema.safeParse(bindings);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  return {
    ...parsed.data,
    PERSONAL_DATABASE_URL: parsed.data.PERSONAL_DATABASE_URL ?? parsed.data.DATABASE_URL,
    PERSONAL_DIRECT_URL: parsed.data.PERSONAL_DIRECT_URL ?? parsed.data.DIRECT_URL,
  };
};

export const requireEnvValue = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`${key} is missing.`);
  }

  return value;
};
