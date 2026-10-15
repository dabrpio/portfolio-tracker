import { z } from 'zod';

export const operationSchema = z.enum([
  'BUY',
  'SELL',
  'DEPOSIT',
  'WITHDRAWAL',
  'DIVIDEND',
]);

export const createTransactionSchema = z.object({
  accountId: z.string(),
  ticker: z.string().min(1, 'Ticker is required'),
  operation: operationSchema,
  quantity: z
    .number('Quantity is required')
    .positive('Quantity must be greater than 0'),
  price: z.number('Price is required').positive('Price must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  transactionDate: z.iso.datetime(),
  transactionTime: z.string().optional(),
  tradingCost: z.number().optional(),
  taxes: z.number().optional(),
  description: z.string().optional(),
});

export const transactionSchema = createTransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.iso.datetime(),
});

export const transactionsSchema = z.array(transactionSchema);

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
