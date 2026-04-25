import { z } from 'zod';

export const personalProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  location: z.string(),
});

export const personalProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'archived']),
});

export type PersonalProfile = z.infer<typeof personalProfileSchema>;
export type PersonalProject = z.infer<typeof personalProjectSchema>;
