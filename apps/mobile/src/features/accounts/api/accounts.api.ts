import { apiFetch } from '@/lib/api-client';
import type { Account, CreateAccount } from '@portfolio-tracker/shared';

export async function getAccounts(): Promise<Account[]> {
  return apiFetch<Account[]>('/accounts');
}

export async function createAccount(data: CreateAccount): Promise<Account> {
  return apiFetch<Account>('/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
