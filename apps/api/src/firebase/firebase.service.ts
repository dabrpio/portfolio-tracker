import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService {
  private readonly app: App;
  private readonly auth: Auth;
  private readonly firestore: Firestore;

  constructor() {
    const existingApp = getApps()[0];

    this.app =
      existingApp ??
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });

    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
  }

  getAuth(): Auth {
    return this.auth;
  }

  getFirestore(): Firestore {
    return this.firestore;
  }
}
