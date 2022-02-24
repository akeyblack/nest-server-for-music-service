import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { Song } from './songs/entities/song.entity';
import { SongsModule } from './songs/songs.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { TokensService } from './tokens/tokens.service';
import { TokensModule } from './tokens/tokens.module';
import { Token } from './tokens/enitites/token.entity';

@Module({
  imports: [
    SongsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.HOST,
      port: config.POSTGRES_PORT,
      username: config.USERNAME,
      password: config.PASSWORD,
      database: config.DATABASE,
      entities: [Song, User, Token],
      synchronize: true,
    }),
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
