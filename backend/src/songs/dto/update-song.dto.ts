import { IsString, Length } from 'class-validator';

export class UpdateSongDto {
  @IsString({ message: 'Must be string' })
  @Length(3, 20, { message: 'Must be 3 to 20 chars' })
  readonly title: string;

  @IsString({ message: 'Must be string' })
  readonly img: string;

  @IsString({ message: 'Must be string' })
  readonly src: string;

  @IsString({ message: 'Must be string' })
  @Length(3, 20, { message: 'Must be 3 to 20 chars' })
  readonly artist: string;
}
