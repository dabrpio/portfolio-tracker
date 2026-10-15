import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Operation } from '@portfolio-tracker/shared';

export interface AssetInfo {
  ticker: string;
  name: string;
  domain?: string;
}

interface ImportTransactionContextValue {
  selectedAccountId: string | null;
  selectedAsset: AssetInfo | null;
  selectedOperation: Operation | null;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedAsset: (asset: AssetInfo | null) => void;
  setSelectedOperation: (op: Operation | null) => void;
  reset: () => void;
}

const ImportTransactionContext = createContext<
  ImportTransactionContextValue | undefined
>(undefined);

export function ImportTransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);
  const [selectedOperation, setSelectedOperation] =
    useState<Operation | null>(null);

  const reset = useCallback(() => {
    setSelectedAccountId(null);
    setSelectedAsset(null);
    setSelectedOperation(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedAccountId,
      selectedAsset,
      selectedOperation,
      setSelectedAccountId,
      setSelectedAsset,
      setSelectedOperation,
      reset,
    }),
    [selectedAccountId, selectedAsset, selectedOperation, reset],
  );

  return (
    <ImportTransactionContext.Provider value={value}>
      {children}
    </ImportTransactionContext.Provider>
  );
}

export function useImportTransaction() {
  const context = useContext(ImportTransactionContext);
  if (!context) {
    throw new Error(
      'useImportTransaction must be used within an ImportTransactionProvider',
    );
  }
  return context;
}
