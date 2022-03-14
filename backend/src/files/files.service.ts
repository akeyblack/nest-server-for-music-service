import { ConfigService } from '@nestjs/config';
import { Injectable, BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ) {
    this.songBucket = this.configService.get('awsBucketName');
    this.imageBucket = this.configService.get('awsImagesBucketName'); 
  }

  songBucket: string;
  imageBucket: string;

  async uploadImageFile(file: Express.Multer.File, id: string): Promise<unknown> {
    if (!file)
      file = await this.getStandartImage();
    return this.uploadS3(file.buffer, this.imageBucket, id, file.mimetype);
  }

  async uploadSongFile(file: Express.Multer.File, id: string): Promise<unknown> {
    const bucket = this.configService.get('awsBucketName');
    return this.uploadS3(file.buffer, this.songBucket,  id, file.mimetype);
  }

  async getImage(key: string): Promise<string> {
    return this.getFromS3(this.imageBucket, key);
  }

  async getSong(key: string): Promise<string> {
    return this.getFromS3(this.songBucket, key)
  }

  async removeImage(key: string): Promise<boolean> {
    return this.removeFromS3(this.imageBucket, key);
  }

  async removeSong(key: string): Promise<boolean> {
    return this.removeFromS3(this.songBucket, key);
  }

  private uploadS3(file, bucket, name, type): Promise<unknown> {
    const s3 = new S3(this.configService.get('aws'));
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: type
    }
    return new Promise((res) => {
      s3.upload(params, (err, data) => {
        if(err) {
          throw new BadGatewayException();
        }
        res(data);
      })
    })
  }

  private getFromS3(bucket, key): Promise<string> {
    const s3 = new S3(this.configService.get('aws'));
    const params = {
      Bucket: bucket,
      Key: String(key),
    }
    return new Promise((res) => {
      s3.getSignedUrl('getObject', params, (err, data) => {
        if(err) {
          throw new BadGatewayException();
        }
        res(data);
      })
    })
  }

  private removeFromS3(bucket, key): Promise<boolean> {
    const s3 = new S3(this.configService.get('aws'));
    const params = {
      Bucket: bucket,
      Key: String(key),
    }
    return new Promise((res) => {
      s3.deleteObject(params, (err, data) => {
        if(err) {
          res(false);
        }
        res(true);
      })
    })
  }

  private async getStandartImage(): Promise<Express.Multer.File> {
    return new Promise(res => {
      fs.readFile('images/unknown.png', (err, file) => {
        if (err) {
          throw new ServiceUnavailableException();
        }
        const newFile = {
          buffer: file,
          mimetype: "image/png"
        }
        res(<Express.Multer.File>newFile);
      });
    });
  }
}
