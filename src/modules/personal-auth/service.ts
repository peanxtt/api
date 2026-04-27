import { createSupabaseClient } from '../../lib/supabase';
import type { Bindings } from '../../types/bindings';
import type { AuthUser, LoginRequest, LoginResponse } from './schema';

export class AuthServiceError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type IdentityContext = {
  userId: string;
  email: string;
};

const mapAuthUser = (user: {
  id: string;
  email?: string | null;
  user_metadata?: { username?: unknown; name?: unknown };
}): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  username: typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : null,
  name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null,
});

const assertMappedUser = (user: AuthUser): AuthUser => {
  if (!user.email) {
    throw new AuthServiceError(500, 'INTERNAL_ERROR', 'Authenticated user is missing an email.');
  }

  return user;
};

export const loginWithPassword = async (
  bindings: Bindings,
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const supabase = createSupabaseClient(bindings);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error || !data.session || !data.user) {
    throw new AuthServiceError(401, 'UNAUTHORIZED', 'Invalid email or password.');
  }

  return {
    user: assertMappedUser(mapAuthUser(data.user)),
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      tokenType: data.session.token_type,
    },
  };
};

export const logoutSession = async (bindings: Bindings, accessToken: string) => {
  const supabase = createSupabaseClient(bindings, { accessToken });
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AuthServiceError(500, 'INTERNAL_ERROR', 'Failed to log out user session.');
  }
};

export const getAuthenticatedUser = async (
  bindings: Bindings,
  accessToken: string,
  identity: IdentityContext,
): Promise<AuthUser> => {
  const supabase = createSupabaseClient(bindings, { accessToken });
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new AuthServiceError(500, 'INTERNAL_ERROR', 'Failed to resolve authenticated user profile.');
  }

  if (!data.user) {
    return {
      id: identity.userId,
      email: identity.email,
      username: null,
      name: null,
    };
  }

  return assertMappedUser(mapAuthUser(data.user));
};
