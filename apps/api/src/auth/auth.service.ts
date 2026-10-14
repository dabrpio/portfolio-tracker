import { Injectable } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly firebase: FirebaseService) {}

  async verifyToken(token: string): Promise<DecodedIdToken> {
    return this.firebase.getAuth().verifyIdToken(token);
  }
}
