import { z } from 'zod';

import type { Bindings } from '../types/bindings';

const envSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  FRONTEND_ORIGINS: z.string().default('*'),
});

export type RuntimeEnv = z.infer<typeof envSchema>;

export const parseEnv = (bindings: Bindings): RuntimeEnv => {
  const parsed = envSchema.safeParse(bindings);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  return parsed.data;
};
