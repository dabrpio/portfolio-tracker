import { useAuth } from '@/features/auth/use-auth';
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../api/accounts.api';

export function useAccounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['accounts', user?.uid],
    queryFn: getAccounts,
    enabled: !!user,
  });
}
