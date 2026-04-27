import { z } from 'zod';

import { parseEnv } from '../../config/env';
import type { Bindings } from '../../types/bindings';

const jwtHeaderSchema = z.object({
  alg: z.string(),
  typ: z.string().optional(),
});

const jwtPayloadSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  exp: z.number().int().positive(),
  iat: z.number().int().optional(),
  nbf: z.number().int().optional(),
});

export type VerifiedAuthIdentity = {
  userId: string;
  email: string;
};

const decodeBase64Url = (input: string): Uint8Array => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const parseJsonPart = <TSchema extends z.ZodTypeAny>(
  tokenPart: string,
  schema: TSchema,
): z.infer<TSchema> => {
  const decoded = new TextDecoder().decode(decodeBase64Url(tokenPart));
  const parsed = JSON.parse(decoded) as unknown;
  return schema.parse(parsed);
};

const verifyHs256Signature = async (
  headerPart: string,
  payloadPart: string,
  signaturePart: string,
  secret: string,
) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  return crypto.subtle.verify(
    'HMAC',
    key,
    decodeBase64Url(signaturePart).buffer as ArrayBuffer,
    new TextEncoder().encode(`${headerPart}.${payloadPart}`),
  );
};

export const verifyAccessToken = async (
  token: string,
  bindings: Bindings,
): Promise<VerifiedAuthIdentity> => {
  const env = parseEnv(bindings);

  if (!env.SUPABASE_JWT_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET is missing.');
  }

  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    throw new Error('JWT format is invalid.');
  }

  const headerPart = tokenParts[0];
  const payloadPart = tokenParts[1];
  const signaturePart = tokenParts[2];

  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error('JWT format is invalid.');
  }

  const header = parseJsonPart(headerPart, jwtHeaderSchema);
  if (header.alg !== 'HS256') {
    throw new Error(`Unsupported JWT algorithm: ${header.alg}`);
  }

  const signatureValid = await verifyHs256Signature(
    headerPart,
    payloadPart,
    signaturePart,
    env.SUPABASE_JWT_SECRET,
  );
  if (!signatureValid) {
    throw new Error('JWT signature validation failed.');
  }

  const payload = parseJsonPart(payloadPart, jwtPayloadSchema);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (payload.nbf && payload.nbf > nowInSeconds) {
    throw new Error('JWT is not active yet.');
  }

  if (payload.exp <= nowInSeconds) {
    throw new Error('JWT has expired.');
  }

  return {
    userId: payload.sub,
    email: payload.email,
  };
};
