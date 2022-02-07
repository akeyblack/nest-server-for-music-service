import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { config } from './db.config';
import { Song } from './songs/entities/song.entity';
import { SongsController } from './songs/songs.controller';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    SongsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.HOST,
      port: config.POSTGRES_PORT,
      username: config.USERNAME,
      password: config.PASSWORD,
      database: config.DATABASE,
      entities: [
        Song
      ],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
