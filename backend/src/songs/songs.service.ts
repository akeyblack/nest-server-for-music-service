import { BadGatewayException, ForbiddenException, HttpException, HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) {}

  async getById(id: string, uid: string): Promise<Song | void> {
    if (await this.isBelongsTo(id, uid))
      return this.songsRepository.findOne(id);
    else 
      throw new ForbiddenException();
  }

  async getAllUserSongs(uid: string): Promise<Song[]> {
    const songs = await this.songsRepository.find({ user: { id: uid}});
    return songs;
  }

  async create(songDto: CreateSongDto, uid: string, image: Express.Multer.File, songfile: Express.Multer.File): Promise<string> {
    const user = await this.usersService.getUserById(uid);
    const song = {
      ...songDto,
      user
    };
    const newSong = await this.songsRepository.save(song);
    try {
      await this.filesService.uploadImageFile(image, newSong.id);
      await this.filesService.uploadSongFile(songfile, newSong.id);
    } catch (err) {
      await this.remove(newSong.id, uid);
      throw new BadGatewayException();
    }
    return newSong.id;
  }

  async update(id: string, songDto: UpdateSongDto, uid: string): Promise<UpdateResult> {
    if (await this.isBelongsTo(id, uid))
      return this.songsRepository.update(id, songDto);
    else 
      throw new ForbiddenException();
  }

  async remove(id: string, uid: string): Promise<boolean> {
    if (await this.isBelongsTo(id, uid)) {
      await this.filesService.removeImage(id);
      await this.filesService.removeSong(id);
      return !!(await this.songsRepository.delete(id)).affected;
    }
    else 
      throw new ForbiddenException();
  }

  private async isBelongsTo(songId, userId): Promise<boolean> {
    const song = await this.songsRepository.findOne({ user: { id: userId}, id: songId })
    return !!song;
  }
}
