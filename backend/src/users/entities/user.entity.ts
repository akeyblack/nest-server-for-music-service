import { Song } from 'src/songs/entities/song.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text' })
  email: string;

  @OneToMany(() => Song, song => song.user)
  songs: Song[]
}
