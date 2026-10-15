import { apiFetch } from '@/lib/api-client';
import type { CreateTransaction, Transaction } from '@portfolio-tracker/shared';

export async function createTransaction(
  data: CreateTransaction,
): Promise<Transaction> {
  return apiFetch<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
