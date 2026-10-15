import { z } from 'zod';

export const accountTypeSchema = z.enum(['brokerage', 'cash']);

export const currencySchema = z.string().length(3);

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required.'),
  type: accountTypeSchema,
  broker: z.string().nullable(),
  currency: currencySchema,
});

export const accountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ...createAccountSchema.shape,
  balance: z.number(),
  lastUpdate: z.string(),
  createdOn: z.string(),
});

export type Account = z.infer<typeof accountSchema>;
export type CreateAccount = z.infer<typeof createAccountSchema>;
