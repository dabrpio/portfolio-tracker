import { Controller, Delete, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete('me')
  deleteCurrentUser(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.usersService.deleteUser(user.uid);
  }
}
