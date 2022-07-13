import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from '../../songs/entities/song.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  email: string;

  @OneToMany(() => Song, song => song.user)
  songs: Song[]
}
