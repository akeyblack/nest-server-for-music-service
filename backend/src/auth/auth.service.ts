import { ConfigService } from '@nestjs/config';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.validateUser(loginDto);
    const tokens = this.tokensService.generateToken(user.id, user.username);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.usersService.getUserByUsername(
      registerDto.username,
    );
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passHash = await bcrypt.hash(registerDto.password, this.configService.get("salt"));
    const newUser = await this.usersService.createUser({
      ...registerDto,
      password: passHash,
    });
    const tokens = this.tokensService.generateToken(newUser.id, newUser.username);
    await this.tokensService.saveToken(newUser.id, tokens.refreshToken);
    
    return tokens;
  }

  async logout(refreshToken: string): Promise<boolean> {
    return this.tokensService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    if(!refreshToken)
      throw new UnauthorizedException();
      
    const userData = await this.tokensService.validateRefreshToken(refreshToken);
    console.log(userData);
    const token = await this.tokensService.findToken(refreshToken);

    if (!userData || !token)
      throw new UnauthorizedException();

    const user = await this.usersService.getUserById(userData.id);
  
    const tokens = this.tokensService.generateToken(user.id, user.username);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);
    
    return tokens;
  }


  private async validateUser(loginDto: LoginDto): Promise<User> {
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
