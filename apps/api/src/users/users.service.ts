import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly firebase: FirebaseService) {}

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    const firestore = this.firebase.getFirestore();
    const auth = this.firebase.getAuth();

    const accountsSnapshot = await firestore
      .collection('accounts')
      .where('userId', '==', userId)
      .get();

    const transactionsSnapshot = await firestore
      .collection('transactions')
      .where('userId', '==', userId)
      .get();

    const allDocs = [...accountsSnapshot.docs, ...transactionsSnapshot.docs];
    const BATCH_SIZE = 500;

    for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
      const batch = firestore.batch();
      const chunk = allDocs.slice(i, i + BATCH_SIZE);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    await auth.deleteUser(userId);

    return { success: true };
  }
}
