import { IsString, Length } from 'class-validator';

export class CreateSongDto {
  @IsString({ message: 'Must be string' })
  @Length(3, 20, { message: 'Must be 3 to 20 chars' })
  readonly title: string;

  @IsString({ message: 'Must be string' })
  @Length(3, 20, { message: 'Must be 3 to 20 chars' })
  readonly artist: string;
}
