import {
    Controller,
    Get,
    Param,
  } from '@nestjs/common';
  import { FilesService } from 'src/files/files.service';
  
  @Controller('files')
  export class FilesController {
    constructor(
      private readonly filesService: FilesService
      ) {}
  
    @Get('images/:id')
    getImage(@Param('id') id: string) {
      return this.filesService.getImage(id);
    }
  
    @Get('mp3/:id')
    getMp3(@Param('id') id: string) {
      return this.filesService.getSong(id);
    }
  
  }
  