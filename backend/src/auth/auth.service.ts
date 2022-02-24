import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { config } from 'src/config';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.tokensService.generateToken(user.id, user.username);
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.usersService.getUserByUsername(
      registerDto.username,
    );
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passHash = await bcrypt.hash(registerDto.password, config.SALT);
    const newUser = await this.usersService.createUser({
      ...registerDto,
      password: passHash,
    });
    const tokens = this.tokensService.generateToken(newUser.id, newUser.username);
    await this.tokensService.saveToken(newUser.id, tokens.refreshToken);
    
    return tokens;
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.getUserByUsername(loginDto.username);
    if (user) {
      const passEquals = await bcrypt.compare(loginDto.password, user.password);
      if (passEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Wrong username or password' });
  }
}
