import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/tokens/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';
import { UserId } from 'src/auth/user-auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getAllByUserId(@UserId() uid: string) {
    return this.songsService.getAllUserSongs(uid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string, @UserId() uid: string) {
    return this.songsService.getById(id, uid);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor("image", {
      dest: "./images"
    })
  )
  @Post()
  create(@Body() songDto: CreateSongDto, @UserId() uid: string) {
    return this.songsService.create(songDto, uid);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(@Param('id') id: string, @Body() songDto: UpdateSongDto, @UserId() uid: string) {
    return this.songsService.update(id, songDto, uid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() uid: string) {
    return this.songsService.remove(id, uid);
  }
}
