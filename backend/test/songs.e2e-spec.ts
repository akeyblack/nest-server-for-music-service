import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SongsModule } from '../src/songs/songs.module';
import { Song } from '../src/songs/entities/song.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';
import { FilesService } from '../src/files/files.service';
import { Token } from '../src/tokens/enitites/token.entity';
import { TokensService } from '../src/tokens/tokens.service';

describe('SongsController (e2e)', () => {
  let app: INestApplication;

  const user = {...new User(), id: "abcde"};
  const songDto = {
    id: "abcd",
    title: "abcd",
    artist: "abcd",
    user
  }
  const accessToken = "Bearer abcd";

  const mockSongsRepository = {
    findOne: jest.fn().mockResolvedValue(songDto),
    find: jest.fn().mockResolvedValue([songDto, songDto]),
    update: jest.fn().mockResolvedValue({affected: 1}),
    delete: jest.fn().mockResolvedValue({affected: 1}),
    save: jest.fn().mockResolvedValue(songDto),
  };
  const mock = {};

  const mockUsersService = {
    getUserById: jest.fn().mockResolvedValue(user)
  };

  const mockTokensService = {
    validateAccessToken: jest.fn().mockResolvedValue(user)
  };

  const mockFilesService = {
    uploadImageFile: jest.fn().mockResolvedValue(true),
    uploadSongFile: jest.fn().mockResolvedValue(true),
    removeImage: jest.fn().mockResolvedValue(true),
    removeSong: jest.fn().mockResolvedValue(true),
  };
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SongsModule],
    })
    .overrideProvider(getRepositoryToken(User)).useValue(mock)
    .overrideProvider(getRepositoryToken(Song)).useValue(mockSongsRepository)
    .overrideProvider(getRepositoryToken(Token)).useValue(mock)
    .overrideProvider(TokensService).useValue(mockTokensService)
    .overrideProvider(FilesService).useValue(mockFilesService)
    .overrideProvider(UsersService).useValue(mockUsersService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/songs/my (GET) => without auth', () => {
    return request(app.getHttpServer())
      .get('/songs/my')
      .expect(401)
  });

  it('/songs/my (GET)', () => {
    return request(app.getHttpServer())
      .get('/songs/my')
      .set('Authorization', accessToken)
      .expect(200)
  });

  it('/songs/my (GET)', () => {
    return request(app.getHttpServer())
      .get(`/songs/${songDto.id}`)
      .set('Authorization', accessToken)
      .expect(200)
      .expect(songDto)
  });

  it('/songs (POST)', () => {
    return request(app.getHttpServer())
      .post('/songs')
      .attach('song', './test/files/test.mp3')
      .attach('image', './test/files/test.png')
      .set('Authorization', accessToken)
      .field('artist', 'abcd')
      .field('title', 'abcd')
      .expect(201)
      .expect(songDto.id)
  });

  it('/songs (POST) without image', () => {
    return request(app.getHttpServer())
      .post('/songs')
      .attach('song', './test/files/test.mp3')
      .set('Authorization', accessToken)
      .field('artist', 'abcd')
      .field('title', 'abcd')
      .expect(201)
      .expect(songDto.id)
  });

  it('/songs (POST) without song', () => {
    return request(app.getHttpServer())
      .post('/songs')
      .set('Authorization', accessToken)
      .field('artist', 'abcd')
      .field('title', 'abcd')
      .expect(400)
  });

  it('/songs/id (PUT) ', () => {
    return request(app.getHttpServer())
      .put(`/songs/${songDto.id}`)
      .set('Authorization', accessToken)
      .send({
        title: "abcd",
        artist: "abcd"
      })
      .expect(200)
      .expect(res => expect(res.text).toEqual("true"))
  });

  it('/songs/id (DELETE) ', () => {
    return request(app.getHttpServer())
      .delete(`/songs/${songDto.id}`)
      .set('Authorization', accessToken)
      .expect(200)
      .expect(res => expect(res.text).toEqual("true"))
  });
});
