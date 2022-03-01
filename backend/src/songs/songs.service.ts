import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    private usersService: UsersService
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

  async create(songDto: CreateSongDto, uid: string): Promise<string> {
    const user = await this.usersService.getUserById(uid);
    const song = {
      ...songDto,
      user
    };
    const newSong = await this.songsRepository.save(song);
    return newSong.id;
  }

  async update(id: string, songDto: UpdateSongDto, uid: string): Promise<UpdateResult> {
    if (await this.isBelongsTo(id, uid))
      return this.songsRepository.update(id, songDto);
    else 
      throw new ForbiddenException();
  }

  async remove(id: string, uid: string): Promise<DeleteResult> {
    if (await this.isBelongsTo(id, uid))
      return this.songsRepository.delete(id);
    else 
      throw new ForbiddenException();
  }

  private async isBelongsTo(songId, userId): Promise<boolean> {
    const song = await this.songsRepository.findOne({ user: { id: userId}, id: songId })
    return !!song;
  }
}
