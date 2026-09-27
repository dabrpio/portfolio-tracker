import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private readonly app: App;
  private readonly auth: Auth;

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
  }

  getAuth(): Auth {
    return this.auth;
  }
}
