import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Headers
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/tokens/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string): any {
    return this.songsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() songDto: CreateSongDto, @Headers() headers): any {
    console.log(headers)
    return this.songsService.create(songDto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(@Param('id') id: string, @Body() songDto: UpdateSongDto): any {
    return this.songsService.update(id, songDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): any {
    return this.songsService.remove(id);
  }
}
