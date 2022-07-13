import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokensService } from './tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokensService: TokensService,
    private usersService: UsersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      if (!req.headers.authorization)
        throw new UnauthorizedException({ message: 'Unauthorized request' });
      const authHeader: string = req.headers.authorization;
      const bearer= authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) 
        throw new UnauthorizedException({ message: 'Unauthorized request' });
      return this.tokensService.validateAccessToken(token).then(data => {
        return this.usersService.getUserById(data.id).then(user => {
          if(user) {
            req.user = user.id;
            return true;
          }
          throw new UnauthorizedException({ message: 'Unauthorized request' });
        })
      });
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized request' });
    }
  }
}
