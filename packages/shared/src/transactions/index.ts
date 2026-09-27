import { z } from "zod";

export const transactionTypeSchema = z.enum(["BUY", "SELL"]);

export const createTransactionSchema = z.object({
  symbol: z.string().min(1),
  type: transactionTypeSchema,
  quantity: z.number().positive(),
  price: z.number().positive(),
  currency: z.string().min(1),
  executedAt: z.iso.datetime(),
});

export const transactionSchema = createTransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.iso.datetime(),
});

export const transactionsSchema = z.array(transactionSchema);

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
