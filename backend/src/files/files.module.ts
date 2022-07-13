import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from './../users/users.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [TokensModule, UsersModule],
  exports: [FilesService]
})
export class FilesModule {}
