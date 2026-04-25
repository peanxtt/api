import type {
  CreateBlogPostInput,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from './schema';

type InvoiceRecord = {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  notes?: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
};

type BlogPostRecord = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
};

export const listInvoices = async (): Promise<InvoiceRecord[]> => {
  // TODO: Replace with Supabase select query.
  return [
    {
      id: 'inv_001',
      customerName: 'Acme Co',
      amount: 1200,
      currency: 'MYR',
      status: 'sent',
      createdAt: new Date().toISOString(),
    },
  ];
};

export const createInvoice = async (payload: CreateInvoiceInput): Promise<InvoiceRecord> => {
  // TODO: Replace with Supabase insert query.
  const baseRecord: InvoiceRecord = {
    id: crypto.randomUUID(),
    customerName: payload.customerName,
    amount: payload.amount,
    currency: payload.currency,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };

  if (payload.notes) {
    return {
      ...baseRecord,
      notes: payload.notes,
    };
  }

  return baseRecord;
};

export const getInvoiceById = async (id: string): Promise<InvoiceRecord> => {
  // TODO: Replace with Supabase select by id query.
  return {
    id,
    customerName: 'Placeholder Customer',
    amount: 300,
    currency: 'MYR',
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
};

export const updateInvoice = async (
  id: string,
  payload: UpdateInvoiceInput,
): Promise<InvoiceRecord> => {
  // TODO: Replace with Supabase update query.
  const existing = await getInvoiceById(id);
  const updated: InvoiceRecord = { ...existing };

  if (payload.customerName !== undefined) {
    updated.customerName = payload.customerName;
  }

  if (payload.amount !== undefined) {
    updated.amount = payload.amount;
  }

  if (payload.currency !== undefined) {
    updated.currency = payload.currency;
  }

  if (payload.notes !== undefined) {
    updated.notes = payload.notes;
  }

  return updated;
};

export const deleteInvoice = async (id: string): Promise<{ id: string; deleted: true }> => {
  // TODO: Replace with Supabase delete query.
  return {
    id,
    deleted: true,
  };
};

export const generateReceipt = async (id: string) => {
  // TODO: Implement real receipt generation and storage flow.
  return {
    invoiceId: id,
    receiptUrl: `https://example.com/receipts/${id}.pdf`,
    generatedAt: new Date().toISOString(),
  };
};

export const listBlogPosts = async (): Promise<BlogPostRecord[]> => {
  // TODO: Replace with Supabase select query.
  return [
    {
      id: 'post_001',
      title: 'Launching Invoice Generator',
      content: 'Placeholder blog post content.',
      tags: ['announcement'],
      createdAt: new Date().toISOString(),
    },
  ];
};

export const createBlogPost = async (payload: CreateBlogPostInput): Promise<BlogPostRecord> => {
  // TODO: Replace with Supabase insert query.
  return {
    id: crypto.randomUUID(),
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
    createdAt: new Date().toISOString(),
  };
};
