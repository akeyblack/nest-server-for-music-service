import { ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import * as path from 'path';

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

  async create(songDto: CreateSongDto, uid: string, image: Express.Multer.File | null, songfile: Express.Multer.File): Promise<string> {
    if (image)
      if (!this.checkFileForImage(image))
      throw new BadRequestException();
    if(!this.checkFileForMp3(songfile))
      throw new BadRequestException();
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
      throw new BadRequestException();
    }
    return newSong.id;
  }

  async update(id: string, songDto: UpdateSongDto, uid: string): Promise<boolean> {
    if (await this.isBelongsTo(id, uid))
      return (await this.songsRepository.update(id, songDto)).affected && true;
    else 
      throw new ForbiddenException();
  }

  async remove(id: string, uid: string): Promise<boolean> {
    if (await this.isBelongsTo(id, uid)) {
      await this.filesService.removeImage(id);
      await this.filesService.removeSong(id);
      return (await this.songsRepository.delete(id)).affected && true;
    }
    else 
      throw new ForbiddenException();
  }

  private async isBelongsTo(songId, userId): Promise<boolean> {
    const song = await this.songsRepository.findOne({ user: { id: userId}, id: songId })
    return !!song;
  }

  private checkFileForImage(file: Express.Multer.File): boolean {
    const allowed = ['.png', '.jpeg', '.jpg', '.gif'];
    if (!allowed.includes(path.extname(file.originalname))) {
      throw new BadRequestException();
    }
    return true;
  }

  private checkFileForMp3(file: Express.Multer.File): boolean {
    const allowed = ['.mp3'];

    if (!allowed.includes(path.extname(file.originalname))) {
      throw new BadRequestException();
    }
    return true;
  }
}
