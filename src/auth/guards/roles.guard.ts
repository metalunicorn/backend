import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/users/models/user.interface';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return of(true);
    }
    const { user } = context.switchToHttp().getRequest();

    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        const hasRole = requiredRoles.indexOf(user.role) > -1;

        return user && hasRole;
      }),
    );
  }
}
