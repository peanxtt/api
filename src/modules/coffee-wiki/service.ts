import type { CreateCoffeeWikiEntryInput } from './schema';

type CoffeeWikiEntry = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
};

export const listWikiEntries = async (): Promise<CoffeeWikiEntry[]> => {
  // TODO: Replace with Supabase select query.
  return [
    {
      id: 'wiki_espresso',
      title: 'Espresso Basics',
      content: 'Dial in grind size and extraction time first.',
      tags: ['espresso', 'beginner'],
      createdAt: new Date().toISOString(),
    },
  ];
};

export const createWikiEntry = async (
  payload: CreateCoffeeWikiEntryInput,
): Promise<CoffeeWikiEntry> => {
  // TODO: Replace with Supabase insert query.
  return {
    id: crypto.randomUUID(),
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
    createdAt: new Date().toISOString(),
  };
};
