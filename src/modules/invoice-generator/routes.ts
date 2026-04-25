import { Hono } from 'hono';

import { authGuard } from '../../middleware/auth';
import { jsonSuccess } from '../../lib/response';
import { validateJson, validateParams } from '../../lib/validation';
import type { AppEnv } from '../../types/bindings';
import {
  createBlogPost,
  createInvoice,
  deleteInvoice,
  generateReceipt,
  getInvoiceById,
  listBlogPosts,
  listInvoices,
  updateInvoice,
} from './service';
import {
  createBlogPostSchema,
  createInvoiceSchema,
  invoiceIdParamSchema,
  updateInvoiceSchema,
} from './schema';

const invoiceGeneratorRoutes = new Hono<AppEnv>();

invoiceGeneratorRoutes.get('/invoices', async (c) => {
  const invoices = await listInvoices();
  return jsonSuccess(c, invoices);
});

invoiceGeneratorRoutes.post('/invoices', authGuard, validateJson(createInvoiceSchema), async (c) => {
  const body = c.req.valid('json');
  const invoice = await createInvoice(body);
  return jsonSuccess(c, invoice, 201);
});

invoiceGeneratorRoutes.get('/invoices/:id', validateParams(invoiceIdParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const invoice = await getInvoiceById(id);
  return jsonSuccess(c, invoice);
});

invoiceGeneratorRoutes.patch(
  '/invoices/:id',
  authGuard,
  validateParams(invoiceIdParamSchema),
  validateJson(updateInvoiceSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const invoice = await updateInvoice(id, body);
    return jsonSuccess(c, invoice);
  },
);

invoiceGeneratorRoutes.delete('/invoices/:id', authGuard, validateParams(invoiceIdParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const result = await deleteInvoice(id);
  return jsonSuccess(c, result);
});

invoiceGeneratorRoutes.post(
  '/invoices/:id/generate-receipt',
  authGuard,
  validateParams(invoiceIdParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const receipt = await generateReceipt(id);
    return jsonSuccess(c, receipt, 201);
  },
);

invoiceGeneratorRoutes.get('/blogposts', async (c) => {
  const posts = await listBlogPosts();
  return jsonSuccess(c, posts);
});

invoiceGeneratorRoutes.post('/blogposts', authGuard, validateJson(createBlogPostSchema), async (c) => {
  const body = c.req.valid('json');
  const post = await createBlogPost(body);
  return jsonSuccess(c, post, 201);
});

export default invoiceGeneratorRoutes;
