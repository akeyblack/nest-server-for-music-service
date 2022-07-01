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
import { JwtAuthGuard } from 'src/tokens/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';
import { UserId } from 'src/auth/user-auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly filesService: FilesService
    ) {}

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
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'song', maxCount: 1},
    { name: 'image', maxCount: 1}
  ]))
  @Post()
  async create(@Body() songDto: CreateSongDto, @UserId() uid: string, 
        @UploadedFiles() files: { song: Express.Multer.File[], image?: Express.Multer.File[] }) {
    if (!files || !files.song)
      throw new BadRequestException();
    const songfile = files.song[0];
    const img = files.image ? files.image[0] : null;
    return this.songsService.create(songDto, uid, img, songfile);
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
