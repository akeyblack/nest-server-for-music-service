import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { TokensService } from './tokens.service';

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
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) 
        throw new UnauthorizedException({ message: 'Unauthorized request' });

      return this.tokensService.validateAccessToken(token).then(data => {
        return this.usersService.getUserById(data.id).then(user => {
          if(user) {
            req.user = user.id;
            req.body.user = user.id;
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
