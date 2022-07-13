import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { UsersModule } from '../users/users.module';
import { Token } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Token]),
    JwtModule.register({
      secret: config().privateKey,
      signOptions: {
        expiresIn: '12h',
      },
    }),
  ],
  exports: [TokensService, JwtModule]
})
export class TokensModule {}
