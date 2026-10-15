import { z } from 'zod';

export const operationSchema = z.enum([
  'BUY',
  'SELL',
  'DEPOSIT',
  'WITHDRAWAL',
  'DIVIDEND',
  'REWARD',
]);

export const cashOperationSchema = z.enum(['DEPOSIT', 'WITHDRAWAL']);
export const stockOperationSchema = z.enum([
  'BUY',
  'SELL',
  'DIVIDEND',
  'REWARD',
]);

export const createCashTransactionSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  operation: cashOperationSchema,
  amount: z
    .number('Amount is required')
    .positive('Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  transactionDate: z.iso.datetime(),
  transactionTime: z.string().optional(),
  description: z.string().optional(),
});

export const createStockTransactionSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  ticker: z.string().min(1, 'Ticker is required'),
  operation: stockOperationSchema,
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

export const createTransactionSchema = z.discriminatedUnion('operation', [
  createCashTransactionSchema,
  createStockTransactionSchema,
]);

export const cashTransactionSchema = createCashTransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.iso.datetime(),
});

export const stockTransactionSchema = createStockTransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.iso.datetime(),
});

export const transactionSchema = z.discriminatedUnion('operation', [
  cashTransactionSchema,
  stockTransactionSchema,
]);

export const transactionsSchema = z.array(transactionSchema);

export type Operation = z.infer<typeof operationSchema>;
export type CashOperation = z.infer<typeof cashOperationSchema>;
export type StockOperation = z.infer<typeof stockOperationSchema>;
export type CreateCashTransaction = z.infer<typeof createCashTransactionSchema>;
export type CreateStockTransaction = z.infer<
  typeof createStockTransactionSchema
>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type CashTransaction = z.infer<typeof cashTransactionSchema>;
export type StockTransaction = z.infer<typeof stockTransactionSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
