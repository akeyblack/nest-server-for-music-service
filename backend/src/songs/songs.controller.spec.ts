import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../tokens/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { UpdateResult } from 'typeorm';

describe('SongsController', () => {
  let controller: SongsController;

  const songDto = {
    id: "abcd",
    title: "abcd",
    artist: "abdc",
    user: new User(),
  }
  const uid = "abc";
  const file = "smth" as unknown as Express.Multer.File; //we can mock File while controller doesn't deal with it anyway

  const mockSongsService = {
    getAllUserSongs: jest.fn().mockImplementation(id => [
      songDto,
      songDto,
    ]),
    getById: jest.fn().mockImplementation((id, uid) => songDto),
    create: jest.fn().mockImplementation((dto, uid, image, songFile) => Promise.resolve(songDto.id)),
    update: jest.fn().mockImplementation((id, dto, uid) => new UpdateResult()),
    remove: jest.fn().mockImplementation((id, uid) => Promise.resolve(true))
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [SongsService],
    })
    .overrideProvider(SongsService).useValue(mockSongsService)
    .overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get uid user`s songs', () => {
    expect(controller.getAllByUserId(uid)).toEqual([
      songDto,
      songDto,
    ]);

    expect(mockSongsService.getAllUserSongs).toHaveBeenCalled();
  });

  it('should get song by id', () => {
    expect(controller.getById(songDto.id, uid)).toEqual(songDto);

    expect(mockSongsService.getById).toHaveBeenCalled();
  });

  it('should create song with default photo', () => {
    expect(controller.create({title: "abc", artist: "abc"}, uid, { song: [file] }))
    .toEqual(Promise.resolve(songDto.id));

    expect(mockSongsService.create).toHaveBeenCalled();
  });

  it('should create song with given photo', () => {
    expect(controller.create({title: "abc", artist: "abc"}, uid, { song: [file], image: [file] }))
    .toEqual(Promise.resolve(songDto.id));

    expect(mockSongsService.create).toHaveBeenCalled();
  });

  it('shouldn`t create any song', () => {
    expect(controller.create({title: "abc", artist: "abc"}, uid, { song: [], image: [] }))
    .toEqual(Promise.resolve({}));

    expect(mockSongsService.create).toHaveBeenCalled();
  });

  it('should update song', () => {
    expect(controller.update(songDto.id, {title: "abc", artist: "abc"}, uid))
    .toEqual(new UpdateResult())

    expect(mockSongsService.update).toHaveBeenCalled();
  });

  it('should remove song', () => {
    expect(controller.remove(songDto.id, uid))
    .toEqual(Promise.resolve(true))

    expect(mockSongsService.remove).toHaveBeenCalled();
  })

});
