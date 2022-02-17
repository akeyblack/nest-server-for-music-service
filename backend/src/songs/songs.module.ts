import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Song } from "./entities/song.entity";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

@Module({
  providers: [SongsService],
  controllers: [SongsController],
  imports: [
    TypeOrmModule.forFeature([Song]),
    AuthModule
  ]
})
export class SongsModule {
}