import { FilesModule } from './files/files.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { SongsModule } from './songs/songs.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    SongsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    }),
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
