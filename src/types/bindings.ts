export interface Bindings {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_JWT_SECRET?: string;
  FRONTEND_ORIGINS?: string;
}

export interface Variables {
  authToken?: string;
}

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
