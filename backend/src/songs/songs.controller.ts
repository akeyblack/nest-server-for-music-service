import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {

  constructor(private readonly songsService: SongsService) {
  }

  @Get(':id')
  getById(@Param('id') id: string): any {
    return this.songsService.getById(id);
  }

  @Post()
  create(@Body() songDto: CreateSongDto): any {
    return this.songsService.create(songDto);
  }

  @Put()
  update(@Body() songDto: UpdateSongDto): any {
    return this.songsService.update(songDto);
  }

  @Delete()
  remove(@Param('id') id: string): any{
    return this.songsService.remove(id);
  }

}
