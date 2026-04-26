import { Hono } from 'hono';

import { jsonSuccess } from '../../lib/response';
import { validateJson } from '../../lib/validation';
import { authGuard } from '../../middleware/auth';
import type { AppEnv } from '../../types/bindings';
import { createCoffeeWikiEntrySchema } from './schema';
import { createWikiEntry, listWikiEntries } from './service';

const coffeeWikiRoutes = new Hono<AppEnv>();

coffeeWikiRoutes.get('/wiki', async (c) => {
  const entries = await listWikiEntries();
  return jsonSuccess(c, entries);
});

coffeeWikiRoutes.post('/wiki', authGuard, validateJson(createCoffeeWikiEntrySchema), async (c) => {
  const body = c.req.valid('json');
  const entry = await createWikiEntry(body);
  return jsonSuccess(c, entry, 201);
});

export default coffeeWikiRoutes;
