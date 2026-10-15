import { Injectable } from '@nestjs/common';
import { FieldValue } from 'firebase-admin/firestore';

import { FirebaseService } from '../firebase/firebase.service.js';
import type { CreateTransaction } from '@portfolio-tracker/shared';

@Injectable()
export class TransactionsService {
  constructor(private readonly firebase: FirebaseService) {}

  async create(userId: string, data: CreateTransaction) {
    const collection = this.firebase.getFirestore().collection('transactions');

    const document = collection.doc();

    const transaction = {
      id: document.id,
      userId,
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    };

    await document.set(transaction);

    return {
      id: document.id,
      userId,
      ...data,
    };
  }
}
