import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "src/db.config";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

@Module({
  providers: [SongsService],
  controllers: [SongsController]
})
export class SongsModule {

}