import { Injectable } from '@nestjs/common';

import { FirebaseService } from '../firebase/firebase.service.js';
import type { Account, CreateAccount } from '@portfolio-tracker/shared';

@Injectable()
export class AccountsService {
  constructor(private readonly firebase: FirebaseService) {}

  async create(userId: string, data: CreateAccount): Promise<Account> {
    const collection = this.firebase.getFirestore().collection('accounts');
    const document = collection.doc();
    const now = new Date().toISOString();

    const account: Account = {
      id: document.id,
      userId,
      ...data,
      balance: 0,
      createdOn: now,
      lastUpdate: now,
    };

    await document.set(account);

    return account;
  }

  async findAll(userId: string): Promise<Account[]> {
    const collection = this.firebase.getFirestore().collection('accounts');
    const snapshot = await collection.where('userId', '==', userId).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Account;
      return data;
    });
  }
}
