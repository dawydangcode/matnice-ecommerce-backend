import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PayloadModel } from 'src/auth/models/payload.model';
import { ROLES_KEY } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: PayloadModel = request.user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role as RoleType);
  }
}
