import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username: username });
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async createUser(userDto: UserDto): Promise<User> {
    return this.userRepository.save(userDto);
  }
}
