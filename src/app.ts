import { Hono } from 'hono';

import { jsonSuccess } from './lib/response';
import { corsMiddleware } from './middleware/cors';
import { registerErrorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import coffeeWikiRoutes from './modules/coffee-wiki/routes';
import invoiceGeneratorRoutes from './modules/invoice-generator/routes';
import personalSiteRoutes from './modules/personal-site/routes';
import type { AppEnv } from './types/bindings';

const app = new Hono<AppEnv>();
const apiV1 = new Hono<AppEnv>();

registerErrorHandler(app);

app.use('*', requestLogger);
app.use('/api/*', corsMiddleware);

app.get('/api/v1/health', (c) =>
  jsonSuccess(c, {
    status: 'ok',
    service: 'personal-api-hub',
    timestamp: new Date().toISOString(),
  }),
);

apiV1.route('/', personalSiteRoutes);
apiV1.route('/', invoiceGeneratorRoutes);
apiV1.route('/', coffeeWikiRoutes);

app.route('/api/v1', apiV1);

export { app };
