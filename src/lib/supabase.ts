import { createClient } from '@supabase/supabase-js';

import { parseEnv } from '../config/env';
import type { Bindings } from '../types/bindings';

type SupabaseClientOptions = {
  useServiceRole?: boolean;
  accessToken?: string;
};

export const createSupabaseClient = (
  bindings: Bindings,
  options: SupabaseClientOptions = {},
) => {
  const env = parseEnv(bindings);

  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is missing.');
  }

  const apiKey = options.useServiceRole ? env.SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_ANON_KEY;

  if (!apiKey) {
    throw new Error(
      options.useServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY is missing.' : 'SUPABASE_ANON_KEY is missing.',
    );
  }

  const clientOptions = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    ...(options.accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${options.accessToken}`,
            },
          },
        }
      : {}),
  };

  return createClient(env.SUPABASE_URL, apiKey, clientOptions);
};
