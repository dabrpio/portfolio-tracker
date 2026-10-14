import { useAuth } from '@/features/auth/use-auth';
import type { Account, CreateAccount } from '@portfolio-tracker/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount } from '../api/accounts.api';

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: CreateAccount) => createAccount(data),
    onSuccess: (newAccount: Account) => {
      queryClient.setQueryData<Account[]>(
        ['accounts', user?.uid],
        (old = []) => [...old, newAccount],
      );
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
