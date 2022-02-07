import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Song } from "./entities/song.entity";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

@Module({
  providers: [SongsService],
  controllers: [SongsController],
  imports: [TypeOrmModule.forFeature([Song])]
})
export class SongsModule {
}