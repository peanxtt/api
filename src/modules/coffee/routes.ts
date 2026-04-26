import { Hono } from 'hono';

import coffeeWikiRoutes from '../coffee-wiki/routes';
import type { AppEnv } from '../../types/bindings';

const coffeeRoutes = new Hono<AppEnv>();

coffeeRoutes.route('/', coffeeWikiRoutes);

export default coffeeRoutes;
