import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  name: z.string().nullable(),
});

export const loginResponseSchema = z.object({
  user: authUserSchema,
  session: z.object({
    accessToken: z.string(),
    refreshToken: z.string().nullable(),
    expiresIn: z.number().nullable(),
    tokenType: z.string().nullable(),
  }),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
