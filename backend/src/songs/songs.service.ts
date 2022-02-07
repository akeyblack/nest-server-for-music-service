import { Injectable } from "@nestjs/common";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";

@Injectable()
export class SongsService {
  private songs = []

  getById(id: string) {
    return this.songs;
  }

  create(songDto: CreateSongDto) {
    this.songs.push({
      ...songDto,
      id: Date.now().toString()
    })
  }

  update(songDto: UpdateSongDto) {
    
  }

  remove(id: string) {

  }
}