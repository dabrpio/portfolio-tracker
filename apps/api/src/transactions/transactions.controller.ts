import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { TransactionsService } from './transactions.service.js';
import type { CreateTransaction } from '@portfolio-tracker/shared';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedRequest['user'],
    @Body() body: CreateTransaction,
  ) {
    return this.transactionsService.create(user.uid, body);
  }
}
