import { describe, expect, it, vi } from 'vitest';

import type { FirebaseService } from '../firebase/firebase.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  it('deletes user accounts, transactions, and auth user', async () => {
    const mockAccountRef = { id: 'acc-1' };
    const mockTransactionRef = { id: 'tx-1' };

    const mockAccountsSnapshot = {
      docs: [{ ref: mockAccountRef }],
    };
    const mockTransactionsSnapshot = {
      docs: [{ ref: mockTransactionRef }],
    };

    const mockBatchDelete = vi.fn();
    const mockBatchCommit = vi.fn().mockResolvedValue(undefined);
    const mockBatch = vi.fn().mockReturnValue({
      delete: mockBatchDelete,
      commit: mockBatchCommit,
    });

    const mockCollection = vi.fn().mockImplementation((name: string) => ({
      where: vi.fn().mockReturnValue({
        get: vi
          .fn()
          .mockResolvedValue(
            name === 'accounts'
              ? mockAccountsSnapshot
              : mockTransactionsSnapshot,
          ),
      }),
    }));

    const mockDeleteUser = vi.fn().mockResolvedValue(undefined);

    const mockFirebase = {
      getFirestore: vi.fn().mockReturnValue({
        collection: mockCollection,
        batch: mockBatch,
      }),
      getAuth: vi.fn().mockReturnValue({
        deleteUser: mockDeleteUser,
      }),
    } as unknown as FirebaseService;

    const service = new UsersService(mockFirebase);
    const result = await service.deleteUser('test-user-123');

    expect(mockCollection).toHaveBeenCalledWith('accounts');
    expect(mockCollection).toHaveBeenCalledWith('transactions');
    expect(mockBatchDelete).toHaveBeenCalledWith(mockAccountRef);
    expect(mockBatchDelete).toHaveBeenCalledWith(mockTransactionRef);
    expect(mockBatchCommit).toHaveBeenCalled();
    expect(mockDeleteUser).toHaveBeenCalledWith('test-user-123');
    expect(result).toEqual({ success: true });
  });

  it('handles user with no documents and deletes auth user', async () => {
    const mockEmptySnapshot = { docs: [] };
    const mockBatchCommit = vi.fn().mockResolvedValue(undefined);
    const mockBatch = vi.fn().mockReturnValue({
      delete: vi.fn(),
      commit: mockBatchCommit,
    });

    const mockCollection = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockEmptySnapshot),
      }),
    });

    const mockDeleteUser = vi.fn().mockResolvedValue(undefined);

    const mockFirebase = {
      getFirestore: vi.fn().mockReturnValue({
        collection: mockCollection,
        batch: mockBatch,
      }),
      getAuth: vi.fn().mockReturnValue({
        deleteUser: mockDeleteUser,
      }),
    } as unknown as FirebaseService;

    const service = new UsersService(mockFirebase);
    const result = await service.deleteUser('empty-user-123');

    expect(mockDeleteUser).toHaveBeenCalledWith('empty-user-123');
    expect(result).toEqual({ success: true });
  });
});
