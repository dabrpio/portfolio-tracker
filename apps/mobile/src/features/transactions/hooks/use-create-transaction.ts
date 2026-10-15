import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTransaction } from '../api/transactions.api';
import type { CreateTransaction, Transaction } from '@portfolio-tracker/shared';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransaction) => createTransaction(data),
    onSuccess: (_newTransaction: Transaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
