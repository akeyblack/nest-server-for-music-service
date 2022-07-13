import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  generateToken(id: string, username: string): { accessToken: string, refreshToken: string } {
    const payload = { id, username };
    const accessToken = this.jwtService.sign(payload, { secret: this.configService.get('accessTokenSalt'), expiresIn: "30m" });
    const refreshToken = this.jwtService.sign(payload, { secret: this.configService.get('refreshTokenSalt'), expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken): Promise<UpdateResult | Token> {
    const token = await this.tokensRepository.findOne({ user_id: userId });
    if (token) {
      token.refreshToken = refreshToken;
      return  this.tokensRepository.update({ user_id: userId }, token);
    }
    return this.tokensRepository.save({
      user_id: userId,
      refreshToken
    })
  }

  async removeToken(refreshToken: string): Promise<boolean> {
    const deleteResult = await this.tokensRepository.delete({ refreshToken });
    return !!deleteResult.affected;
  }

  async findToken(refreshToken: string): Promise<Token> {
    return this.tokensRepository.findOne({ refreshToken });
  }

  async validateAccessToken(token: string): Promise<User> {
    try {
      const user = await this.jwtService.verifyAsync(token, { secret: this.configService.get('accessTokenSalt') });
      return user;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized request' });
    }
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const user = await this.jwtService.verifyAsync(token, { secret: this.configService.get('refreshTokenSalt') });
      return user;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized request' });
    }
  }
}
