import { describe, expect, it, vi } from 'vitest';

import type { FirebaseService } from '../firebase/firebase.service.js';
import { AccountsService } from './accounts.service.js';

describe('AccountsService', () => {
  it('creates an account and returns it without userId', async () => {
    const mockSet = vi.fn().mockResolvedValue(undefined);
    const mockDoc = vi.fn().mockReturnValue({
      id: 'mock-account-id',
      set: mockSet,
    });
    const mockCollection = vi.fn().mockReturnValue({
      doc: mockDoc,
    });
    const mockFirestore = {
      collection: mockCollection,
    };
    const mockFirebase = {
      getFirestore: vi.fn().mockReturnValue(mockFirestore),
    } as unknown as FirebaseService;

    const service = new AccountsService(mockFirebase);
    const result = await service.create('test-user-123', {
      name: 'XTB Main',
      type: 'brokerage',
      broker: 'XTB',
      currency: 'USD',
    });

    expect(mockCollection).toHaveBeenCalledWith('accounts');
    expect(mockDoc).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-account-id',
        userId: 'test-user-123',
        name: 'XTB Main',
        type: 'brokerage',
        broker: 'XTB',
        currency: 'USD',
        balance: 0,
      }),
    );
    expect(result).toEqual({
      id: 'mock-account-id',
      userId: 'test-user-123',
      name: 'XTB Main',
      type: 'brokerage',
      broker: 'XTB',
      currency: 'USD',
      balance: 0,
      createdOn: expect.any(String),
      lastUpdate: expect.any(String),
    });
  });

  it('retrieves accounts for a specific user', async () => {
    const mockDocs = [
      {
        id: 'acc-1',
        data: () => ({
          id: 'acc-1',
          userId: 'test-user-123',
          name: 'Main Cash',
          type: 'cash',
          broker: null,
          currency: 'EUR',
          balance: 0,
          createdOn: '2026-10-11T10:00:00.000Z',
          lastUpdate: '2026-10-11T10:00:00.000Z',
        }),
      },
    ];

    const mockGet = vi.fn().mockResolvedValue({ docs: mockDocs });
    const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
    const mockCollection = vi.fn().mockReturnValue({ where: mockWhere });
    const mockFirestore = { collection: mockCollection };
    const mockFirebase = {
      getFirestore: vi.fn().mockReturnValue(mockFirestore),
    } as unknown as FirebaseService;

    const service = new AccountsService(mockFirebase);
    const result = await service.findAll('test-user-123');

    expect(mockCollection).toHaveBeenCalledWith('accounts');
    expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'test-user-123');
    expect(result).toEqual([
      {
        id: 'acc-1',
        userId: 'test-user-123',
        name: 'Main Cash',
        type: 'cash',
        broker: null,
        currency: 'EUR',
        balance: 0,
        createdOn: '2026-10-11T10:00:00.000Z',
        lastUpdate: '2026-10-11T10:00:00.000Z',
      },
    ]);
  });
});
