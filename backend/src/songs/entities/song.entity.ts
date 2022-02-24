import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  src: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  artist: string;

  @Column({ type: 'text' })
  img: string;

  @ManyToOne(() => User, user => user.songs)
  user: User;
}
