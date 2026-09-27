import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';

export type AuthenticatedRequest = Request & {
  user: {
    uid: string;
    email?: string;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authorization.slice('Bearer '.length);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const decodedToken = await this.authService.verifyToken(token);

      (request as AuthenticatedRequest).user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
}
