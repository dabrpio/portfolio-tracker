import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { CreateAccount } from '@portfolio-tracker/shared';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { AccountsService } from './accounts.service.js';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.accountsService.findAll(user.uid);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedRequest['user'],
    @Body() body: CreateAccount,
  ) {
    return this.accountsService.create(user.uid, body);
  }
}
