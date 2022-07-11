import { Test } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { User } from '../users/entities/user.entity';
import { UpdateResult } from 'typeorm';

describe(' Test suite', () => {
  let service: SongsService;

  const songDto = {
    id: "abcd",
    title: "abcd",
    artist: "abdc",
    user: new User(),
  }
  const uid = "abc";
  const file = "smth" as unknown as Express.Multer.File; //we can mock File while controller doesn't deal with it anyway

  const mockSongsRepository = {
    findOne: jest.fn().mockResolvedValue(songDto),
    find: jest.fn().mockResolvedValue([songDto, songDto]),
    update: jest.fn().mockResolvedValue(UpdateResult),
    delete: jest.fn().mockResolvedValue({affected: 1}),
    save: jest.fn().mockResolvedValue(songDto),
  };

  const mockUsersService = {
    getUserById: jest.fn().mockResolvedValue(new User)
  };

  const mockFilesService = {
    uploadImageFile: jest.fn().mockResolvedValue(true),
    uploadSongFile: jest.fn().mockResolvedValue(true),
    removeImage: jest.fn().mockResolvedValue(true),
    removeSong: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: mockSongsRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        }
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find song by id and return', async () => {
    expect(await service.getById(songDto.id, uid)).toEqual(songDto);
  });

  it('should find all songs by user id', async () => {
    expect(await service.getAllUserSongs(uid)).toEqual([songDto, songDto]);
  });

  it('should create song', async () => {
    expect(await service.create(
      { title: songDto.title, artist: songDto.artist },
      uid,
      file,
      file
    )).toEqual(songDto.id);
  });

  it('should update song data', async () => {
    expect(await service.update(
      songDto.id,
      { title: songDto.title, artist: songDto.artist },
      uid
    )).toEqual(UpdateResult);
  });

  it('should remove song', async () => {
    expect(await service.remove(songDto.id, uid)).toEqual(true);
  });
});