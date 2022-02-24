import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async getById(id: string): Promise<Song> {
    return this.songsRepository.findOne(id);
  }

  async create(songDto: CreateSongDto): Promise<Song> {
    return this.songsRepository.save(songDto);
  }

  async update(id: string, songDto: UpdateSongDto): Promise<UpdateResult> {
    return this.songsRepository.update(id, songDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.songsRepository.delete(id);
  }
}
