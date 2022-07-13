import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../tokens/jwt-auth.guard';
import { UserId } from '../auth/user-auth.decorator';
import { ValidationPipe } from '../pipes/validation.pipe';
import { Song } from './entities/song.entity';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getAllByUserId(@UserId() uid: string): Promise<Song[]> {
    return this.songsService.getAllUserSongs(uid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string, @UserId() uid: string): Promise<Song | void> {
    return this.songsService.getById(id, uid);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'song', maxCount: 1},
    { name: 'image', maxCount: 1}
  ]))
  @Post()
  create(@Body() songDto: CreateSongDto, @UserId() uid: string, 
        @UploadedFiles() files: { song: Express.Multer.File[], image?: Express.Multer.File[] }): Promise<string> {
    if(!files || !files.song)
        throw new BadRequestException();
    const songFile = files.song[0];
    const img = files.image ? files.image[0] : null;
    return this.songsService.create(songDto, uid, img, songFile);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(@Param('id') id: string, @Body() songDto: UpdateSongDto, @UserId() uid: string): Promise<boolean> {
    return this.songsService.update(id, songDto, uid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() uid: string): Promise<boolean> {
    return this.songsService.remove(id, uid);
  }
}
