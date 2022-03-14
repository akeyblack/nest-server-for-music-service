import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { Song } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  providers: [SongsService],
  controllers: [SongsController],
  imports: [TypeOrmModule.forFeature([Song]), TokensModule, UsersModule, FilesModule],
})
export class SongsModule {}
