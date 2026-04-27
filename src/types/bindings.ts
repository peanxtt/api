export interface Bindings {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_JWT_SECRET?: string;
  DATABASE_URL?: string;
  DIRECT_URL?: string;
  PERSONAL_DATABASE_URL?: string;
  PERSONAL_DIRECT_URL?: string;
  COFFEE_DATABASE_URL?: string;
  COFFEE_DIRECT_URL?: string;
  FRONTEND_ORIGINS?: string;
}

export interface Variables {
  authToken?: string;
  userId?: string;
  email?: string;
}

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
