import { z } from 'zod';

export const invoiceIdParamSchema = z.object({
  id: z.string().min(1, 'Invoice id is required.'),
});

export const createInvoiceSchema = z.object({
  customerName: z.string().min(1, 'customerName is required.'),
  amount: z.number().positive('amount must be greater than 0.'),
  currency: z.string().length(3).default('MYR'),
  notes: z.string().optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'title is required.'),
  content: z.string().min(1, 'content is required.'),
  tags: z.array(z.string()).default([]),
});

export type InvoiceIdParam = z.infer<typeof invoiceIdParamSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
