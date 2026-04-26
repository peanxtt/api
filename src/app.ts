import { Hono } from 'hono';

import { jsonSuccess } from './lib/response';
import { corsMiddleware } from './middleware/cors';
import { registerErrorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import coffeeRoutes from './modules/coffee/routes';
import personalRoutes from './modules/personal/routes';
import type { AppEnv } from './types/bindings';

const app = new Hono<AppEnv>();
const apiV1 = new Hono<AppEnv>();
const personalApi = new Hono<AppEnv>();
const coffeeApi = new Hono<AppEnv>();

registerErrorHandler(app);

app.use('*', requestLogger);

app.get('/api/v1/health', (c) =>
  jsonSuccess(c, {
    status: 'ok',
    service: 'personal-api-hub',
    timestamp: new Date().toISOString(),
  }),
);

personalApi.use('*', corsMiddleware);
coffeeApi.use('*', corsMiddleware);

personalApi.route('/', personalRoutes);
coffeeApi.route('/', coffeeRoutes);

apiV1.route('/personal', personalApi);
apiV1.route('/coffee', coffeeApi);

app.get('/api/docs', (c) =>
  jsonSuccess(c, {
    status: 'pending',
    message: 'OpenAPI/Swagger bootstrap route is active. Full documentation is scheduled for Phase 8.',
  }),
);

app.route('/api/v1', apiV1);

export { app };
