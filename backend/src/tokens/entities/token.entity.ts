
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'uuid' })
  user_id: string;
}
