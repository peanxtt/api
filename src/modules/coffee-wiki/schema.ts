import { z } from 'zod';

export const createCoffeeWikiEntrySchema = z.object({
  title: z.string().min(1, 'title is required.'),
  content: z.string().min(1, 'content is required.'),
  tags: z.array(z.string()).default([]),
});

export type CreateCoffeeWikiEntryInput = z.infer<typeof createCoffeeWikiEntrySchema>;
