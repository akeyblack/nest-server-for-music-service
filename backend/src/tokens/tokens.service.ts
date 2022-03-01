import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'src/config';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Token } from './enitites/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    private jwtService: JwtService
  ) {}

  generateToken(id: string, username: string): { accessToken: string, refreshToken: string } {
    const payload = { id, username };
    const accessToken = this.jwtService.sign(payload, { secret: config.ACCESS_TOKEN_SALT, expiresIn: "30m" });
    const refreshToken = this.jwtService.sign(payload, { secret: config.REFRESH_TOKEN_SALT, expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken): Promise<UpdateResult | Token> {
    const token = await this.tokensRepository.findOne({ user_id: userId });;
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
    return this.jwtService.verifyAsync(token, { secret: config.ACCESS_TOKEN_SALT });
  }

  async validateRefreshToken(token: string): Promise<User> {
    return this.jwtService.verifyAsync(token, { secret: config.REFRESH_TOKEN_SALT });
  }
}