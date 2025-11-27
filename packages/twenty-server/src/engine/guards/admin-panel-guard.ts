import {
    type CanActivate,
    type ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { type Observable } from 'rxjs';

export class AdminPanelGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request.user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (request.user.canAccessFullAdminPanel !== true) {
      throw new ForbiddenException(
        'You do not have permission to access the Admin Panel',
      );
    }

    return true;
  }
}
