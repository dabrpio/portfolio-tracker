import { apiFetch } from '@/lib/api-client';

export async function deleteCurrentUser(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/users/me', {
    method: 'DELETE',
  });
}
