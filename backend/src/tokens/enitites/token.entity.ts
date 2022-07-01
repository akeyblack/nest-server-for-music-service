import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'uuid' })
  user_id: string;
}
