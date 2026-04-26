import { Hono } from 'hono';

import invoiceGeneratorRoutes from '../invoice-generator/routes';
import personalSiteRoutes from '../personal-site/routes';
import type { AppEnv } from '../../types/bindings';

const personalRoutes = new Hono<AppEnv>();

personalRoutes.route('/', personalSiteRoutes);
personalRoutes.route('/', invoiceGeneratorRoutes);

export default personalRoutes;
